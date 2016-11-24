/*jshint node:true*/

const packagesToAdd = [
  { name: 'rasterizehtml', target: '^1.2.3' },
  { name: 'ember-browserify', target: '1.1.12' },
];

module.exports = {
  description: 'ember-rasterize',
  normalizeEntityName: function() {}, // no-op since we're just adding dependencies

  afterInstall: function() {
    return this.addPackagesToProject(packagesToAdd); // is a promise
  },

  afterUninstall: function() {
    return this.removePackagesFromProject(packagesToAdd);
  },
};
