/* Convert the generated binary STL to OBJ or a single-object 3MF. */
'use strict';
async function convertModel(stl, format) {
  if (format === 'stl') return stl;
  const input = new DataView(await stl.arrayBuffer()), count = input.getUint32(80, true);
  if (input.byteLength !== 84 + count * 50) throw new Error('Invalid STL geometry');
  const vertices = [], faces = [], lookup = new Map();
  for (let i = 0; i < count; i++) {
    const start = 84 + i * 50 + 12, face = [];
    for (let v = 0; v < 3; v++) {
      const pos = start + v * 12, xyz = [input.getFloat32(pos, true), input.getFloat32(pos + 4, true), input.getFloat32(pos + 8, true)];
      if (xyz.some(n => !Number.isFinite(n))) throw new Error('Invalid vertex');
      const key = xyz.join(','); let id = lookup.get(key);
      if (id === undefined) { id = vertices.length; lookup.set(key, id); vertices.push(xyz); }
      face.push(id);
    }
    faces.push(face);
  }
  if (format === 'obj') {
    const lines = ['# Pixel Plate Studio - units: millimetres\n'];
    for (const v of vertices) lines.push(`v ${v.join(' ')}\n`);
    for (const f of faces) lines.push(`f ${f.map(i => i + 1).join(' ')}\n`);
    return new Blob(lines, {type: 'model/obj'});
  }
  if (format !== '3mf') throw new Error('Unsupported model format');
  const xml = ['<?xml version="1.0" encoding="UTF-8"?><model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"><resources><object id="1" type="model"><mesh><vertices>'];
  for (const [x,y,z] of vertices) xml.push(`<vertex x="${x}" y="${y}" z="${z}"/>`);
  xml.push('</vertices><triangles>');
  for (const [a,b,c] of faces) xml.push(`<triangle v1="${a}" v2="${b}" v3="${c}"/>`);
  xml.push('</triangles></mesh></object></resources><build><item objectid="1"/></build></model>');
  const contentTypes = '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/></Types>';
  const rels = '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/></Relationships>';
  return makeZip([['[Content_Types].xml',contentTypes],['_rels/.rels',rels],['3D/3dmodel.model',xml.join('')]]);
}
function makeZip(files) {
  const enc = new TextEncoder(), local = [], central = []; let offset = 0;
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1; table[n] = c >>> 0; }
  function crc32(bytes) { let c = 0xffffffff; for (const b of bytes) c = table[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
  function header(size) { const arr = new Uint8Array(size); return [arr,new DataView(arr.buffer)]; }
  for (const [filename,text] of files) {
    const name = enc.encode(filename), data = enc.encode(text), crc = crc32(data), [lh,l] = header(30);
    l.setUint32(0,0x04034b50,true); l.setUint16(4,20,true); l.setUint16(6,0x800,true); l.setUint32(14,crc,true); l.setUint32(18,data.length,true); l.setUint32(22,data.length,true); l.setUint16(26,name.length,true); local.push(lh,name,data);
    const [ch,c] = header(46); c.setUint32(0,0x02014b50,true); c.setUint16(4,20,true); c.setUint16(6,20,true); c.setUint16(8,0x800,true); c.setUint32(16,crc,true); c.setUint32(20,data.length,true); c.setUint32(24,data.length,true); c.setUint16(28,name.length,true); c.setUint32(42,offset,true); central.push(ch,name); offset += lh.length + name.length + data.length;
  }
  const centralSize = central.reduce((n,b) => n + b.length,0), [end,e] = header(22);
  e.setUint32(0,0x06054b50,true); e.setUint16(8,files.length,true); e.setUint16(10,files.length,true); e.setUint32(12,centralSize,true); e.setUint32(16,offset,true);
  return new Blob([...local,...central,end], {type:'model/3mf'});
}
