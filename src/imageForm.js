const createFormImage = (photo) => {
    const data = new FormData();
  
    data.append("file", {
      name: photo.fileName,
      type: photo.type,
      uri: photo.uri,
    });

    return data;
  };

export default createFormImage;