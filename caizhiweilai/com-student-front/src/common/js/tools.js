// 该方法判断一个文件属于什么类型
export function getFileType(fileExten) {
  let fileType = 'VIDEO'
  const fileExtenUp = fileExten.toUpperCase()
  switch (fileExtenUp) {
    case 'JPG':
    case 'GIF':
    case 'JPEG':
    case 'PNG':
    case 'SVG':
    case 'BMP':
      fileType = 'PIC'
      break
    case 'XLSX':
    case 'XLS':
      fileType = 'EXCEL'
      break
    case 'PDF':
      fileType = 'PDF'
      break
    case 'MP3':
      fileType = 'MP3'
      break
    case 'PPT':
    case 'PPTX':
    case 'POTM':
    case 'POTX':
      fileType = 'PPT'
      break
    case 'TXT':
    case 'TEXT':
      fileType = 'TXT'
      break
    case 'DOCX':
    case 'DOC':
      fileType = 'WORD'
      break
    case 'EXE' :
      fileType = 'EXE'
      break
    case 'AUTOWORK' :
      fileType = 'AUTOWORK'
      break
    case 'SQL' :
      fileType = 'SQL'
      break
    case 'PY' :
      fileType = 'PY'
      break
    case 'PBIX' :
      fileType = 'PBIX'
      break
  }
  return fileType
}
// 下载
export function downloadByBlob (url, name) {
  const image = new Image()
  image.setAttribute('crossOrigin', 'anonymous')
  image.src = url
  image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, image.width, image.height)
      canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob)
          download(url, name)
          // 用完释放URL对象
          URL.revokeObjectURL(url)
      })
  }
}
function download (href, name) {
  const eleLink = document.createElement('a')
  eleLink.download = name
  eleLink.href = href
  eleLink.click()
  eleLink.remove()
}
