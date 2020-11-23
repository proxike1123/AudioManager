export const buildImage = image => {
  const {mime, path} = image;
  const uri = path;
  const uriTokens = uri.split('/');
  const name = uriTokens[uriTokens.length - 1];
  const result = {uri, name, type: mime};
  return result;
};
