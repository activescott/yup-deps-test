

This repo is to demonstrate a dependency issue I've found using packages that are dependent upon yup. The issue manifests as the following error:

    Cannot find module '@babel/runtime/helpers/builtin/interopRequireDefault' from 'reach.js'

      at Resolver.resolveModule (node_modules/jest-resolve/build/index.js:221:17)
      at Object.<anonymous> (node_modules/react-formal/node_modules/yup/lib/util/reach.js:3:30)

Note that that the parent project also include yup in `node_modules/yup`, but the file with the issue is in `node_modules/react-formal/node_modules/yup`. The reasons is that react-formal references yup, but it requires 


To see this issue, simply clone this repo and run the following commands:

    yarn
    yarn test

It is an issue that many people have as noted in https://github.com/jquense/yup/issues/216

It only occurs when using babel in the host application. It seems the root cause is that yup takes a [strict equal comparator](https://github.com/npm/node-semver#ranges) dependency on @babel/runtime with the syntax `"@babel/runtime": "7.0.0"` as shown [here](https://github.com/jquense/yup/blob/6ab83bcc1c0bdf4febb237c4961d6e48ffd201ec/package.json#L87).
When the host application is using a newer version of the @babel/runtime, the `@babel/runtime/helpers/builtin/interopRequireDefault` helper emitted into the yup packaged/distributed source is not found since that module is apparently alread loaded from a later version of @babel/runtime.

To fix the issue, we will take the following attemps:

1. pkg.module: Publishing a "module" entry in the yup package.json. Some notes on this:
    - https://github.com/nodejs/node-eps/blob/master/002-es-modules.md
    - https://github.com/nodejs/node-eps/blob/4217dca299d89c8c18ac44c878b5fe9581974ef3/002-es6-modules.md#51-determining-if-source-is-an-es-module
    - https://github.com/rollup/rollup/wiki/pkg.module
2. Remove the strict "equal comparator" dependency on @babel/runtime and allow it to flow to newer versions. AFAICT in looking through git blame, it seems the only reason it is pinned is due to yup being dependent on early beta versions of @babel/runtime at one point which is now production code and presumably honoring semver so this shouldn't be necessary to stay pinned any longer: https://github.com/jquense/yup/pull/276

Ultimately, both seem to be the right thing to do anyway, so I kinda think we should do both.

I've done both locally to confirm and rebuilt yup & react-formal locally and it makes this project work again.
