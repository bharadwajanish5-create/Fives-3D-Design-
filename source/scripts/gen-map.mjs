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
for (let lat = 36; lat >= 6; lat -= 0.55) for (let lon = 67; lon <= 98; lon += 0.55)
  if (geoContains(india, [lon, lat])) ind.push([+lon.toFixed(2), +lat.toFixed(2)]);
writeFileSync(new URL('../src/data/mapDots.json', import.meta.url), JSON.stringify({ world, india: ind }));
console.log('world', world.length, 'india', ind.length);
