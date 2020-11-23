import createFormImage from './imageForm'
import url from './url'
const URL = url;

 const callApi = (params) => {
  // console.log('params callapi', params)
  // console.log('params.api', params.api)
  // console.log('params.param', params.param)
  // console.log('params.token', params.token)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var data = JSON.stringify(params.param);

    if (params.method != 'GET') {
      var requestOptions = {
        method: params.method,
        headers: myHeaders,
        body: data,
      };
    }
    else {
      var requestOptions = {
        method: params.method,
        headers: myHeaders,
      };
    }
    // console.log('requestOptions', requestOptions)

    return fetch(URL + params.api, requestOptions)
      .then(res => res.json())
      .then(res => res)
      .catch(error => error);
}

const uploadImage = () => {
  var myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");
  // myHeaders.append("Content-Type", "multipart/form-data");
  // myHeaders.append("Content-Type': 'application/x-www-form-urlencoded");
  console.log(createFormImage(params.param))
  if (params.method != 'GET') {
    var requestOptions = {
      method: params.method,
      headers: myHeaders,
      body: {
        name: 'file',
        filename: params.param.name,
        type: params.param.type,
        data: createFormImage(params.param.uri)
      },
    };
  }
  else {
    var requestOptions = {
      method: params.method,
      headers: myHeaders,
    };
  }
  // console.log('requestOptions', requestOptions)

  return fetch(URL + params.api, requestOptions)
    .then(res => res.json())
    .then(res => res)
    .catch(error => error);
}

export {
  callApi,
  uploadImage
}
