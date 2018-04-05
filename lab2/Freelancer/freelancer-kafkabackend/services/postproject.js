var mongoClient = require('./mongo');

function handle_request(msg, callback){

    console.log("In update user profile handle request:", msg);
   mongoClient.connect((err, db) => {
       db.collection('projects').insertOne({
           id: msg.id,
           title: msg.title,
           description: msg.description,
           skills_required: msg.skillsRequired,
           budgetrange: msg.budgetrange,
           employer: msg.owner,
           open: 'open',
           worker: '',
           number_of_bids: 0,
           estimated_completion_date: null,
           comment: ''
       }).then( (response) => {
           console.log("Project Insertion Successfully");
           console.log(response.insertedId);
           callback(null, 'PROJECT_INSERTED_SUCCESS');
       })
   })

}

exports.handle_request = handle_request;