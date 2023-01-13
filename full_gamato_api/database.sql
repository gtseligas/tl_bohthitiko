DROP DATABASE IF EXISTS tlproject;
CREATE DATABASE tlproject;
USE tlproject;
/* For all the tables *_myid corresponds to an auto incrementing id.
   *_id corresponds to the string id that we will return in the JSON file.
   For example it can be 
    questionnaire_myid = 1 
    questionnaire_id = 'QQ001'
*/

CREATE TABLE questionnaire(
    questionnaire_myid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    questionnaire_id VARCHAR(255) NOT NULL,
    questionnaire_title VARCHAR(255) NOT NULL
);

CREATE TABLE keyword(
    keyword_myid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(255) NOT NULL
);

CREATE TABLE questionnaire_keyword(
    questionnaire_myid INT ,
    keyword_myid INT,
    PRIMARY KEY(questionnaire_myid, keyword_myid),
    CONSTRAINT fk_questionnaire_keyword_questionnaire FOREIGN KEY (questionnaire_myid) 
	    REFERENCES questionnaire(questionnaire_myid) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_questionnaire_keyword_keyword FOREIGN KEY (keyword_myid) 
	    REFERENCES keyword(keyword_myid) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE question(
    question_myid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    question_id VARCHAR(255) NOT NULL,
    question_text VARCHAR(255) NOT NULL,
    question_required BOOLEAN NOT NULL,
    question_type ENUM('profile', 'question')
);

CREATE TABLE questionnaire_question(
    questionnaire_myid INT,
    question_myid INT,
    PRIMARY KEY(questionnaire_myid, question_myid),
    CONSTRAINT fk_questionnaire_question_questionnaire FOREIGN KEY (questionnaire_myid) 
	    REFERENCES questionnaire(questionnaire_myid) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_questionnaire_question_question FOREIGN KEY (question_myid) 
	    REFERENCES question(question_myid) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE user_option(
    /* 'option' is reserved word se we use 'user_option' as name */
    user_option_myid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_option_id VARCHAR(255) NOT NULL,
    user_option_text VARCHAR(255) NOT NULL, /* If the option is an open option i.e. textbox, 
    we will always assign 'open-string' to this column.
    Otherwise we assign the option text as normal. */
    question_myid INT NOT NULL, /* The question where this option belongs.
    If each option corresponds to only one question this should not be in a separate table*/
    next_question_myid INT, /* This can be null if there is no next question */
    CONSTRAINT fk_user_option_question FOREIGN KEY (question_myid) 
	    REFERENCES question(question_myid) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_user_option_next_question FOREIGN KEY (question_myid) 
	    REFERENCES question(question_myid) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE user_session(
    /* 'session' is a reserved word se we use 'user_session' as name */
    user_session_myid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_session_id VARCHAR(255) NOT NULL
);

CREATE TABLE qqso(
    /* Name stands for questionnaire_question_session_option.
       Tells us which option was selected for the question of the questionnaire in a specific session. 
    */
    questionnaire_myid INT NOT NULL,
    question_myid INT NOT NULL,
    user_session_myid INT NOT NULL,
    user_option_myid INT NOT NULL,
    inserted_text VARCHAR(255), /* This will only be used if the option was an open string option, i.e. a textbox,
    to hold the text that was inserted. For closed options it will be null, as the option text already exists in the 
    'user_option' table. */ 
    PRIMARY KEY(questionnaire_myid, question_myid, user_session_myid),
    CONSTRAINT fk_qqso_questionnaire FOREIGN KEY (questionnaire_myid) 
	    REFERENCES questionnaire(questionnaire_myid) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_qqso_question FOREIGN KEY (question_myid) 
	    REFERENCES question(question_myid) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_qqso_user_session FOREIGN KEY (user_session_myid) 
	    REFERENCES user_session(user_session_myid) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_qqso_user_option FOREIGN KEY (user_option_myid)
	    REFERENCES user_option(user_option_myid) ON DELETE RESTRICT ON UPDATE CASCADE
); 

