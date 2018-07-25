import fs from "fs-extra"
import { rollup } from "rollup"
import denodeify from "denodeify"
import rimraf from "rimraf"

import rebasePlugin from "../src"

const stat = denodeify(fs.stat)
const rimrafp = denodeify(rimraf)
const readFile = denodeify(fs.readFile)

const outputFolder = "./__tests__/output/"

function bundle(input, outputFile, pluginOptions = {}) {
  const plugin = rebasePlugin(pluginOptions)

  return rollup({
    input,
    plugins: [ plugin ]
  }).then((result) =>
    result.write({
      format: "es",
      file: outputFile
    })
  )
}

function fileExists(name) {
  return stat(name).then((result) => true, (error) => false)
}

beforeAll(() => {
  return rimrafp(outputFolder)
})

test("Plain", () => {
  const outputFile = `${outputFolder}/plain/index.js`

  return bundle("./__tests__/fixtures/plain.js", outputFile)
    .then(() => Promise.all([ expect(fileExists(outputFile)).resolves.toBeTruthy() ]))
    .then(Promise.all([ rimrafp(outputFile) ]))
})



test("Assets", () => {
  const outputFile = `${outputFolder}/assets/index.js`

  const imageFile = `${outputFolder}/assets/fEGHuKIT.png`
  const fontFile = `${outputFolder}/assets/cNxsXFOx.woff`
  const deepFile = `${outputFolder}/assets/ceBqZEDY.gif`
  const cssFile = `${outputFolder}/assets/gayDQjlm.css`
  const cssFont = `${outputFolder}/assets/gadyfD.woff`

  return bundle("./__tests__/fixtures/assets.js", outputFile)
    .then(() =>
      Promise.all([
        expect(fileExists(outputFile)).resolves.toBeTruthy(),
        readFile(outputFile, "utf-8").then((content) => {
          expect(content).toMatchSnapshot()
        }),
        expect(fileExists(imageFile)).resolves.toBeTruthy(),
        expect(fileExists(fontFile)).resolves.toBeTruthy(),
        expect(fileExists(deepFile)).resolves.toBeTruthy(),
        expect(fileExists(cssFile)).resolves.toBeTruthy(),
        expect(fileExists(cssFont)).resolves.toBeTruthy()
      ])
    )
    .then(
      Promise.all([
        rimrafp(outputFile),
        rimrafp(imageFile),
        rimrafp(fontFile),
        rimrafp(deepFile),
        rimrafp(cssFile),
        rimrafp(cssFont)
      ])
    )
})

test("Assets written to subfolder", () => {
  const outputFile = `${outputFolder}/assets-subfolder/index.js`

  const imageFile = `${outputFolder}/assets-subfolder/static/fEGHuKIT.png`
  const fontFile = `${outputFolder}/assets-subfolder/static/cNxsXFOx.woff`
  const deepFile = `${outputFolder}/assets-subfolder/static/ceBqZEDY.gif`
  const cssFile = `${outputFolder}/assets-subfolder/static/gayDQjlm.css`
  const cssFont = `${outputFolder}/assets-subfolder/static/gadyfD.woff`

  const options = {
    folder: "static"
  }

  return bundle("./__tests__/fixtures/assets.js", outputFile, options)
    .then(() =>
      Promise.all([
        expect(fileExists(outputFile)).resolves.toBeTruthy(),
        readFile(outputFile, "utf-8").then((content) => {
          expect(content).toMatchSnapshot()
        }),
        expect(fileExists(imageFile)).resolves.toBeTruthy(),
        expect(fileExists(fontFile)).resolves.toBeTruthy(),
        expect(fileExists(deepFile)).resolves.toBeTruthy(),
        expect(fileExists(cssFile)).resolves.toBeTruthy(),
        expect(fileExists(cssFont)).resolves.toBeTruthy()
      ])
    )
    .then(
      Promise.all([
        rimrafp(outputFile),
        rimrafp(imageFile),
        rimrafp(fontFile),
        rimrafp(deepFile),
        rimrafp(cssFile),
        rimrafp(cssFont)
      ])
    )
})

test("Outside Asset Source Location", () => {
  const outputFile = `${outputFolder}/outside/index.js`

  const imageFile = `${outputFolder}/outside/fEGHuKIT.png`
  const fontFile = `${outputFolder}/outside/cNxsXFOx.woff`
  const deepFile = `${outputFolder}/outside/ceBqZEDY.gif`
  const cssFile = `${outputFolder}/outside/gayDQjlm.css`
  const cssFont = `${outputFolder}/outside/gadyfD.woff`

  return bundle("./__tests__/fixtures/deep/assets-outside.js", outputFile)
    .then(() =>
      Promise.all([
        expect(fileExists(outputFile)).resolves.toBeTruthy(),
        readFile(outputFile, "utf-8").then((content) => {
          expect(content).toMatchSnapshot()
        }),
        expect(fileExists(imageFile)).resolves.toBeTruthy(),
        expect(fileExists(fontFile)).resolves.toBeTruthy(),
        expect(fileExists(deepFile)).resolves.toBeTruthy(),
        expect(fileExists(cssFile)).resolves.toBeTruthy(),
        expect(fileExists(cssFont)).resolves.toBeTruthy()
      ])
    )
    .then(
      Promise.all([
        rimrafp(outputFile),
        rimrafp(imageFile),
        rimrafp(fontFile),
        rimrafp(deepFile),
        rimrafp(cssFile),
        rimrafp(cssFont)
      ])
    )
})

test("Mixed Asset Source Locations", () => {
  const outputFile = `${outputFolder}/mixed/index.js`

  const fontFile = `${outputFolder}/mixed/cNxsXFOx.woff`
  const svgFile = `${outputFolder}/mixed/foixBwnR.svg`
  const deepFile = `${outputFolder}/mixed/ceBqZEDY.gif`
  const cssFile = `${outputFolder}/mixed/gayDQjlm.css`
  const cssFont = `${outputFolder}/mixed/gadyfD.woff`

  return bundle("./__tests__/fixtures/deep/assets-mixed.js", outputFile)
    .then(() =>
      Promise.all([
        expect(fileExists(outputFile)).resolves.toBeTruthy(),
        readFile(outputFile, "utf-8").then((content) => {
          expect(content).toMatchSnapshot()
        }),
        expect(fileExists(fontFile)).resolves.toBeTruthy(),
        expect(fileExists(svgFile)).resolves.toBeTruthy(),
        expect(fileExists(deepFile)).resolves.toBeTruthy(),
        expect(fileExists(cssFile)).resolves.toBeTruthy(),
        expect(fileExists(cssFont)).resolves.toBeTruthy()
      ])
    )
    .then(
      Promise.all([
        rimrafp(outputFile),
        rimrafp(fontFile),
        rimrafp(svgFile),
        rimrafp(deepFile),
        rimrafp(cssFile),
        rimrafp(cssFont)
      ])
    )
})

// test("Keep Name", () => {
//   const outputFile = `${outputFolder}/assets-hash-appened/index.js`

//   const imageFile = `${outputFolder}/assets-hash-appened/image_fEGHuKIT.png`
//   const fontFile = `${outputFolder}/assets-hash-appened/font_cNxsXFOx.woff`
//   const deepFile = `${outputFolder}/assets-hash-appened/blank_ceBqZEDY.gif`
//   const cssFile = `${outputFolder}/assets-hash-appened/css-font_gayDQjlm.css`
//   const cssFont = `${outputFolder}/assets-hash-appened/css-font_gadyfD.woff`

//   return bundle("./__tests__/fixtures/assets.js", outputFile, {
//     keepName: true
//   })
//     .then(() =>
//       Promise.all([
//         expect(fileExists(outputFile)).resolves.toBeTruthy(),
//         readFile(outputFile, "utf-8").then((content) => {
//           expect(content).toMatchSnapshot()
//         }),
//         expect(fileExists(imageFile)).resolves.toBeTruthy(),
//         expect(fileExists(fontFile)).resolves.toBeTruthy(),
//         expect(fileExists(deepFile)).resolves.toBeTruthy(),
//         expect(fileExists(cssFile)).resolves.toBeTruthy(),
//         expect(fileExists(cssFont)).resolves.toBeTruthy()
//       ])
//     )
//     .then(
//       Promise.all([
//         rimrafp(outputFile),
//         rimrafp(imageFile),
//         rimrafp(fontFile),
//         rimrafp(deepFile),
//         rimrafp(cssFile),
//         rimrafp(cssFont)
//       ])
//     )
// })
