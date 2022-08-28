export default function img(file, dir = "Assets/Images/") {
  const image = new Image();
  image.src = dir + file;
  return image;
}
