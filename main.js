var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// ボットの準備
//=========================================================

// Restifyサーバの設定
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

// ボットの接続先設定
var connector = new builder.ChatConnector({
  // MicrosoftBotFramework公式サイトで取得した、IDとパスワードを入力します
  appId: '447b12d4-a280-412a-a87b-3ac141ad3406',
  appPassword: 'a6LYtemLmzi3OFiVTKUUA8c'
});

// ボットの仕組みを提供してくれるUniversalBotオブジェクトを作成
var bot = new builder.UniversalBot(connector);

// ***/api/messagesをエンドポイントとして、ボットをサーバで提供する
server.post('/api/messages', connector.listen());



//=========================================================
// IntentDialogオブジェクトの用意
//=========================================================

// 認識に指定するLUIS APIのURLを指定
var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v1/application?id=e1cad7be-67ba-4ac7-9f7f-4d1d0cd8d8f1&subscription-key=6794a217a4e3435b92c4d99f377ad0fd');

// IntentDialogオブジェクトを作成
var intents = new builder.IntentDialog({
  recognizers: [recognizer]
});


//=========================================================
// 会話の処理
//=========================================================

// 初期ダイアログを、intentDialogとして使用する
bot.dialog('/', intents);

// インテントと処理の結びつけ
intents
    .matches('greeting', function (session, args) {
///////////////////////////////////////////////////////////////////////////////

        // インテントが 'intentA' だったときの処理をここに記述します。
console.log(args);
        // EntityRecognizerを使うと、指定したエンティティの内容を抽出できます。
        var username = builder.EntityRecognizer.findEntity(args.entities, 'name');
        var greet = builder.EntityRecognizer.findEntity(args.entities, 'greet');
        if (username || greet) {
            session.send(greet.entity + "!!" + username.entity + "さん!！MC株式会社のウェブサイトへようこそ。"); // この場合、「東京」が出力されます。
        }
	else {
            session.send("こんにちは！MC株式会社のウェブサイトへようこそ。");
	}



/////////////////////////////////////////////////////////////////////////////

    })




    .matches('mc_position', function (session, args) {

      console.log(args);

      var bot_map = builder.EntityRecognizer.findEntity(args.entities,'map');
      var bot_subway = builder.EntityRecognizer.findEntity(args.entities,'subway');

      if(bot_map){
        session.send(bot_map.entity + "地図はこちらです。");
      }else if(bot_subway){
      session.send(bot_subway.entity + "青山一丁目です。");
      }else {
                session.send("わかりません。");
    	}

    })




    .matches('greet', function (session, args) {

        // インテントが 'intentC' だったときの処理をここに記述します。


        // ▼ 応用 ▼

        // argsの中には、LUISの認識結果が入っています。
        console.log(args);

            //  例えば、天気予報Botを想定したLUISの場合 : 「明日の東京の天気は？」を解析すると..

            //  { score: 1,
            //  intent: 'AskWeather',
            //  intents:
            //   [ { intent: 'AskWeather', score: 1, actions: [Object] },
            //     { intent: 'None', score: 0.0144235147 } ],
            //  entities:
            //   [ { entity: '東京',
            //       type: '場所',
            //       startIndex: 3,
            //       endIndex: 4,
            //       score: 0.9854452 },
            //     { entity: '明日',
            //       type: '日にち',
            //       startIndex: 0,
            //       endIndex: 1,
            //       score: 0.963219762 } ] }

            // 上記のような結果が得られます。


        // EntityRecognizerを使うと、指定したエンティティの内容を抽出できます。
    //    var username = builder.EntityRecognizer.findEntity(args.entities, 'name');

        // 「場所」エンティティが認識できた場合の処理
      //  if (username) {
      //      session.send(username + "さんこんにちは！MC株式会社のウェブサイトへようこそ。"); // この場合、「東京」が出力されます。
    //    }
//	else {
          ////  session.send("こんにちは！MC株式会社のウェブサイトへようこそ。");
//	}

    })

    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    // ※ インテントの数だけ .matches('*****', ... ) を繰り返します。
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    .onDefault(function(session){

            session.endDialog("ごめんなさい。不足で意味がわかりません。");

    });
