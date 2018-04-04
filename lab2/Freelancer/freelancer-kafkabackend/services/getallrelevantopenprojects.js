var mongo = require('./mongo');

function handle_request(msg, callback) {
    mongo.connect((err, db) => {
        var userSkills = null;
        var userSkillsArray = null;
        var allOpenProjectsArray = null;
        var finalRelevantProjectsArray = [];


            console.log("Connected to mongodb...");

            var query = {username: msg.username};
            db.collection("users").find(query).toArray( (err, result) => {
                if(err) {
                    console.log('ERROR');
                    callback(null, 'ERROR');
                }

                if(result.length > 0) {
                    userSkills = result[0].skills;
                    if(userSkills === null) {
                        console.log("User has not updated any skills...");
                        callback(null, {"finalRelevantProjectsArray": finalRelevantProjectsArray});

                    }

                    else {
                        userSkillsArray = userSkills.split(",");
                        console.log("User Skills Array...", userSkillsArray);
                        db.collection("projects").find({open:'open'}).toArray( (err, result) => {
                            if(err) {
                                console.log(err);
                                callback(null, 'ERROR');

                            }

                            if(result.length > 0) {
                                allOpenProjectsArray = result;
                                var count = 0;
                                for(var i = 0; i < allOpenProjectsArray.length; i++) {
                                    count = 0;
                                    var projectRequiredSkillsArray = allOpenProjectsArray[i].skills_required.split(',');
                                    console.log("projectRequiredSkillsArray",projectRequiredSkillsArray);
                                    for(var j = 0; j < userSkillsArray.length; j++) {
                                        for(var k = 0; k < projectRequiredSkillsArray.length; k++) {
                                            if(userSkillsArray[j].toLowerCase() === projectRequiredSkillsArray[k].toLocaleLowerCase()) {
                                                count++;
                                            }
                                        }
                                    }
                                    console.log("Final Skills matched count...", count);
                                    if(count >= 2) {
                                        finalRelevantProjectsArray.push(allOpenProjectsArray[i]);
                                    }
                                }
                                console.log("Matched final skills projects...", finalRelevantProjectsArray);

                                callback(null, {"finalRelevantProjectsArray" : finalRelevantProjectsArray});
                            }

                        });
                    }

                }
            });




    })
}

exports.handle_request = handle_request;