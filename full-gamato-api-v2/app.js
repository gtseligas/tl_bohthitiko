const express=require("express");
const app=express();
const mongoose=require("mongoose");
require("dotenv/config");

const Questionnaire = require("./model/Questionnaire");
const Session = require("./model/Session");

/*ignore, helper gia eisagwgh */
app.get('/', async(req, res)=>{
    
    const result=await Questionnaire.create({
        "questionnaireID": "QQ004",
        "questionnaireTitle": "ghjkGH",
        "keywords": ["ghjk", "UIOe"],
        "questions":[{"qID":"P04", "qtext":"tfpow", "required":false,"type":"question", "options":[{"optID":"OO06", "opttxt":"why", "nextqID":"QQ005"}]}]
    });
    
    console.log(result);

    res.send(result);
});


app.get('/questionnaire/:questionnaireID', async(req, res)=>{   
    const id = req.params.questionnaireID;
    const projection={questionnaireID:1, questionnaireTitle:1, keywords:1, _id:0, "questions.qID":1,"questions.qtext":1, "questions.required":1, "questions.type":1};
    Questionnaire.find({questionnaireID: id}, projection, (err, data)=>{
        if(err){
            res.json({"status":"failed", "reason":err.message});
        }else{
            res.send(data[0]);
        }
    });
});

app.post('/doanswer/:questionnaireID/:questionID/:session/:optionID', async(req, res)=>{   
    const qqid = req.params.questionnaireID;
    const qid = req.params.questionID;
    const sess = req.params.session;
    const optid = req.params.optionID;
    
    const result = await Session.create({
        "questionnaireID": qqid,
        "session": sess,
        "qID": qid,
        "ans": optid
    });
});

app.get('/getsessionanswers/:questionnaireID/:session', async(req, res)=>{
    const qid = req.params.questionnaireID;
    const sess = req.params.session;

    const projection = {_id:0, qID:1, ans:1}

    Session.find({questionnaireID: qid, session:sess}, projection, (err, data)=>{
        if(err){
            res.json({"status":"failed", "reason":err.message});
        }else{
           console.log(data);

           let result={
            questionnaireID:String,
            session:String,
            answers:                   
                [{
                qID:String,
                ans:String
                }]
            }

            result.questionnaireID = qid;
            result.session = sess;
            result.answers = data;

           res.send(result);
        }
    });
});

app.get('/getquestionanswers/:questionnaireID/:questionID', async(req, res)=>{
    const qqid = req.params.questionnaireID;
    const qid = req.params.questionID;

    const projection = {_id:0, session:1, ans:1}

    Session.find({questionnaireID: qqid, qID:qid}, projection, (err, data)=>{
        if(err){
            res.json({"status":"failed", "reason":err.message});
        }else{
           console.log(data);

           let result={
            questionnaireID:String,
            questionID:String,
            answers:                   
                [{
                session:String,
                ans:String
                }]
            }

            result.questionnaireID = qqid;
            result.questionID = qid;
            result.answers = data;

           res.send(result);
        }
    });
});

app.get('/question/:questionnaireID/:questionID', async(req, res)=>{   
    const id1 = req.params.questionnaireID;
    console.log("yei");
    const id2 = req.params.questionID;
    const projection={questionnaireID:1, _id:0, "questions.qID":1,"questions.qtext":1, "questions.required":1, "questions.type":1, "questions.options.optID":1, "questions.options.opttxt":1, "questions.options.nextqID":1};
    Questionnaire.find({questionnaireID: id1, "questions.qID":id2}, projection, (err, data)=>{
        if(err){
            res.json({"status":"failed", "reason":err.message});
        }else{
            let result={
                questionnaireID:String,
                qID:String,
                qtext:String,
                required:Boolean,
                type:{
                    type:String,
                    enum:['profile', 'question']
                },
                options:                   
                    [{
                    optID:String,
                    opttxt:String,
                    nextqID : String
                    }]
            }
            result.questionnaireID=data[0].questionnaireID;
            result.qID=data[0].questions[0].qID;
            result.qtext=data[0].questions[0].qtext;
            result.required=data[0].questions[0].required;
            result.type=data[0].questions[0].type;
            result.options=data[0].questions[0].options;
            console.log(result);
            res.send(result);
        }
    });
    
});

app.post('/admin/resetall', async(req, res)=>{   
    try {
        Questionnaire.deleteMany({});
        Session.deleteMany({});

        res.json({"status":"OK"});
    } catch (error) {
        res.json({"status":"failed", "reason":error.message});
    }
});

app.post('/admin/resetq/:questionnaireID', async(req, res)=>{   
    const qqid = req.params.questionnaireID;

    try {
        Session.deleteMany({questionnaireID : qqid});

        res.json({"status":"OK"});
    } catch (error) {
        res.json({"status":"failed", "reason":error.message});
    }
});

const fs = require("fs");
const multer=require("multer");
const upload=multer({dest:'uploads/'});


//!!ΠΡΟΣΟΧΗ: οι φροντεαδες να το ονομάσουν file και να θεσουν multipart/form-data
//να το φτιαξω να μην δημιουργει folder
app.post('/admin/questionnaire_upd', upload.single('file'), function(req, res){
    fs.readFile('./uploads/'+req.file.filename, 'utf8', async(err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const json=JSON.parse(data);

        const result=await Questionnaire.create({
            "questionnaireID": json.questionnaireID,
            "questionnaireTitle": json.questionnaireTitle,
            "keywords": json.keywords,
            "questions":json.questions
        });
        
       //console.log(result);   
       // μηπως δεν θα επρεπε να περιμενει για res?
       res.send(result);
      });
      
});


mongoose.connect(process.env.DB_CONNECTION, ()=>{
    console.log("Server connected on port 5000");
});


app.listen(5000);