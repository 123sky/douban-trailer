// Helper functions.
const getContext = function() {
  return document.createElement('canvas').getContext('2d')
}

const getImageData = function(img, loaded) {
  const imgObj = new Image()
  const imgSrc = img.src || img

  // Can't set cross origin to be anonymous for data url's
  // https://github.com/mrdoob/three.js/issues/1305
  if (imgSrc.substring(0, 5) !== 'data:') imgObj.crossOrigin = 'Anonymous'

  imgObj.onload = function() {
    const context = getContext('2d')
    context.drawImage(imgObj, 0, 0)

    const imageData = context.getImageData(0, 0, imgObj.width, imgObj.height)
    loaded && loaded(imageData.data)
  }

  imgObj.src = imgSrc
}

const makeRGB = function(name) {
  return ['rgb(', name, ')'].join('')
}

const PALETTESIZE = 10

const RGBaster = {}

RGBaster.colors = function(img, opts) {
  opts = opts || {}
  const exclude = opts.exclude || []
  const paletteSize = opts.paletteSize || PALETTESIZE

  getImageData(img, function(img) {
    const BLOCKSIZE = 5

    const length = img.width * img.height || img.length
    const colorCounts = {}
    let rgbString = ''
    const rgb = []
    const colors = {
      dominant: { name: '', count: 0 },
      opposite: { name: '' },
      palette: Array.apply(null, new Array(paletteSize))
        .map(Boolean)
        .map(function(a) {
          return { name: '0,0,0', count: 0 }
        })
    }

    let i = 0
    while (i < length) {
      rgb[0] = img[i]
      rgb[1] = img[i + 1]
      rgb[2] = img[i + 2]
      rgbString = rgb.join(',')

      // Keep track of counts.
      if (rgbString in colorCounts) {
        colorCounts[rgbString] = colorCounts[rgbString] + 1
      } else {
        colorCounts[rgbString] = 1
      }

      // Find dominant and palette, ignoring those colors in the exclude list.
      if (exclude.indexOf(makeRGB(rgbString)) === -1) {
        const colorCount = colorCounts[rgbString]
        if (colorCount > colors.dominant.count) {
          colors.dominant.rgb = makeRGB(rgbString)
          colors.dominant.name = rgbString
          colors.dominant.count = colorCount
        } else {
          colors.palette.some(function(c) {
            if (colorCount > c.count) {
              c.rgb = makeRGB(rgbString)
              c.name = rgbString
              c.count = colorCount
              return true
            }
          })
        }
      }
      i += BLOCKSIZE * 4
    }

    const c = colors.dominant.name.split(',')
    const grayLevel = c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114
    if (grayLevel >= 192) {
      // 若为浅色，把文字设置为黑色
      colors.opposite = '#000'
    } else {
      colors.opposite = '#fff'
    }

    if (opts.success) {
      opts.success(colors)
    }
  })
}

export default RGBaster
