// Generates a dotted land grid (lon/lat) from world-atlas for the delivery map.
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';
const topo = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/countries-110m.json', import.meta.url)));
const land = feature(topo, topo.objects.countries);
const feats = land.features.filter(f => f.properties.name !== 'Antarctica');
function grid(step, lonMin, lonMax, latMin, latMax) {
  const out = [];
  for (let lat = latMax; lat >= latMin; lat -= step) {
    for (let lon = lonMin; lon <= lonMax; lon += step) {
      if (feats.some(f => geoContains(f, [lon, lat]))) out.push([+lon.toFixed(2), +lat.toFixed(2)]);
    }
  }
  return out;
}
const world = grid(2.2, -170, 180, -56, 78);
const india = feats.find(f => f.properties.name === 'India');
const ind = [];
// square grid in Mercator space so the India map is north-up, undistorted and evenly dotted
const D = 0.55 * Math.PI / 180, my = (la) => Math.log(Math.tan(Math.PI / 4 + (la * Math.PI / 180) / 2));
for (let y = my(36); y >= my(6); y -= D) {
  const lat = (2 * Math.atan(Math.exp(y)) - Math.PI / 2) * 180 / Math.PI;
  for (let lon = 67; lon <= 98; lon += 0.55) if (geoContains(india, [lon, lat])) ind.push([+lon.toFixed(3), +lat.toFixed(3)]);
}
writeFileSync(new URL('../src/data/mapDots.json', import.meta.url), JSON.stringify({ world, india: ind }));
console.log('world', world.length, 'india', ind.length);
