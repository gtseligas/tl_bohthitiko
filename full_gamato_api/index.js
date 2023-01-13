const express = require('express');
const app = express();
const cors = require('cors');
var pool = require('./db');

app.use(cors());
app.use(express.json());

app.post('/admin/resetall', async(req, res) => {
    try {
      await pool.query('delete from questionnaire_keyword;');
      await pool.query('delete from keyword;');
      await pool.query('delete from questionnaire_question;');
      await pool.query('delete from qqso;');
      await pool.query('delete from user_session;');
      await pool.query('delete from user_option;');
      await pool.query('delete from question;');
      await pool.query('delete from questionnaire;');

      // return status:OK JSON
      res.json({"status":"OK"});
    } catch (error) {
      res.json({"status":"failed", "reason":error.message});  
    }
});

app.post('/admin/resetq/:questionnaireID', async(req, res) => {
  try {
    const id = req.params.questionnaireID;
    
    await pool.query("delete from qqso where questionnaire_myid in (select questionnaire_myid from questionnaire where questionnaire_id=?)", [id]);

    // return status:OK JSON
    res.json({"status":"OK"});
  } catch (error) {
    res.json({"status":"failed", "reason":error.message});
  }
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });