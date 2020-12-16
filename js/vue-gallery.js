// Flickr API key
const apiKey = '0a7a25b9a48a2e889f13f022f82f7ff8';

/**
 * ---------------------------------------
 * Flickrの画像読み込み
 * ---------------------------------------
 */

// リクエストパラメータを作る 猫
const getRequestURL = (searchText) => {
  const parameters = $.param({
    method: 'flickr.photos.search',
    api_key: apiKey,
    text: 'cat', // 検索テキスト
    sort: 'interestingness-desc', // 興味深さ順
    per_page: 4, // 取得件数
    license: '4', // Creative Commons Attributionのみ
    extras: 'owner_name,license', // 追加で取得する情報
    format: 'json', // レスポンスをJSON形式に
    nojsoncallback: 1, // レスポンスの先頭に関数呼び出しを含めない
  });
  const url =` https://api.flickr.com/services/rest/?${parameters}`;
  return url;
};

// リクエストパラメータを作る 犬
const getRequestURL2 = (searchText) => {
const parameters = $.param({
  method: 'flickr.photos.search',
  api_key: apiKey,
  text: 'dog', // 検索テキスト
  sort: 'interestingness-desc', // 興味深さ順
  per_page: 4, // 取得件数
  license: '4', // Creative Commons Attributionのみ
  extras: 'owner_name,license', // 追加で取得する情報
  format: 'json', // レスポンスをJSON形式に
  nojsoncallback: 1, // レスポンスの先頭に関数呼び出しを含めない
});
const url =` https://api.flickr.com/services/rest/?${parameters}`;
return url;
};



// photoオブジェクトからFlickr画像データのURLを返す
const getFlickrImageURL = (photo, size) => {
  let url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${
    photo.secret
  }`;
  if (size) {
    // サイズ指定ありの場合
    url += `_${size}`;
  }
  url += '.jpg';
  return url;
};

// photoオブジェクトからFlickr画像の元ページのURLを返す
const getFlickrPageURL = photo => `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;

// Flickr画像のaltテキストを返す
const getFlickrText = (photo) => {
  let text = `"${photo.title}" by ${photo.ownername}`;
  if (photo.license === '4') {
    // Creative Commons Attribution（CC BY）ライセンス
    text += ' / CC BY';
  }
  return text;
};






/**
 * ----------------------------------
 * Tooltipを表示するカスタムディレクティブ
 * ----------------------------------
 */

Vue.directive('tooltip', {
  bind(el, binding) {
    $(el).tooltip({
      title: binding.value,
      placement: 'bottom',
    });
  },
  unbind(el) {
    $(el).tooltip('dispose');
  },
});

new Vue({
  el: '#gallery', // elオプションの値に '#gallery' を設定

  components: {
  },

  data: {
    // Vueインスタンスのデータとして配列を用意。写真データを入れる
    photos: [],
    imageData:[],
  },
  
  
  created() {
    // Vueが読み込まれたときに実行する処理を定義
      this.fetchImagesFromFlickr('cat');
      this.fetchImagesFromFlickr('dog');
  },

  methods: {
    // 呼び出して利用できる関数を定義( aaa や bbb の関数名を書き換えること。関数の追加も可能 )
    fetchImagesFromFlickr(searchText) {
      const url = getRequestURL(searchText);
      const url2 = getRequestURL2(searchText);

      $.getJSON(url, (data) => {
        console.log(data);
        if (data.stat !== 'ok') {
          return;
        }
        this.photos = data.photos.photo.map(photo => ({
          id: photo.id,
          imageURL: getFlickrImageURL(photo, 'q'),
          pageURL: getFlickrPageURL(photo),
          text: getFlickrText(photo),
          }),
          
          );

        

          });
        
          $.getJSON(url2, (data) => {
            console.log(data);

            const imageData2 = data.photos.photo.map(photo => ({
              id: photo.id,
              imageURL: getFlickrImageURL(photo, 'q'),
              pageURL: getFlickrPageURL(photo),
              text: getFlickrText(photo),
              }),
              
              );
            this.photos = this.photos.concat(imageData2);
   
              });
          
 


        },

      },
});

