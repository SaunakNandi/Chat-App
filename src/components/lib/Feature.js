const fileFormat=(url="")=>{
  const fileExtention=url.split('.').pop()
  if(fileExtention==='mp4' || fileExtention==='webm' || fileExtention==='ogg') return "video"
  if(fileExtention==='mp3' || fileExtention==='wav') return "audio"
  if(fileExtention==='jpg' || fileExtention==='png' || fileExtention==='jpeg' || fileExtention==='gif') return "image"
  return "file"
}
const transformImage=(url="",width=100)=>{
  return url
}

// This function solves the following problem
// if A sends message to B and B have not checked yet then B can see 1 new message, but if B reloads the page then the 1 New Message get removed.
// So we will store the newMessagesAlert in localStorage to save the message alert.
const getOrSaveFromStorage=({key,value,get})=>{
  if(get) return localStorage.getItem(key)? JSON.parse(localStorage.getItem(key)):null
  console.log("got called")
  localStorage.setItem(key,JSON.stringify(value))
}
export {fileFormat, transformImage, getOrSaveFromStorage}