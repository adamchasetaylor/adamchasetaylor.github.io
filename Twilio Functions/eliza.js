exports.handler = function(context, event, callback) {

    let actions = [];
    let options = [];

    function processReflections(output){
        output = output.replace("your","my");
        output = output.replace("yours", "mine");
        output = output.replace("yourself", "myself");
        output = output.replace("youself", "myself");    
        return output;       
    }

    function elisaRegularize(input){
        input = input.replace("Im", "I am");
        input = input.replace("I'm", "I am");
        input = input.replace("Iam", "I am");
        input = input.replace("im", "I am"); 
        input = input.replace("i'm", "I am");   
        input = input.replace("iam", "I am");    
        input = input.replace("I am feeling", "I feel");   
        return input;
    }

    function elisaRegex(input,regex){
        input = input.replace(" sometimes ", " ");
        input = input.replace(" often ", "");        
        input = input.replace(" you ever ", " you ");
        input = input.replace(" you never ", " you ");
        input = input.replace(" is ", " ");
        input = input.replace(" are ", " ");
        let match = input.match(regex)[1];
        if(match === null){
            return `"input"`;
        }
        match = match.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g,"");
        return processReflections(match);
    }
    
    let match = "";
    let input = elisaRegularize(event.CurrentInput);
    
    switch(event.CurrentTask){
        case "greeting":
            options = ["Hello... I'm glad you could drop by today.","Hi there... how are you today?","Hello, how are you feeling today?"];    
            break;
        case "dontyou":
            match = elisaRegex(input,/you (.*)/);
            options = [`Do you really think I don't ${match}?`,`Perhaps eventually I will ${match}`,`Do you really want me to ${match}?`];    
            break;
        case "iam":
            match = elisaRegex(input,/am (.*)/);
            options = [`Did you come to me because you are ${match}?`,`How long have you been ${match}?`,`How do you feel about being ${match}?`,
            `How does being ${match} make you feel?`,`Do you enjoy being ${match}`,`Why do you think you're ${match}?`];    
            break;
        case "need":
            match = elisaRegex(input,/need (.*)/);
            options = [`Why do you need ${match}?`, `Would it really help you to get ${match}?`, `Are you sure you need ${match}?`];
            break;
        case "feel":
            match = elisaRegex(input,/feel (.*)/);
            options = [`Good, tell me more about these feelings.`, `Do you often feel ${match}?`, `When do you usually feel ${match}?`, `When you feel ${match}, what do you do?`];
            break;
        case "goodbye":
            options =   ["Thank you for talking with me.", "Good-bye.", "Thank you, that will be $300.  Have a good day!"];
            break;
        default:
            options = ["Say again?"]
    }

    let selected = options[Math.floor(Math.random()*options.length)];

    let say = {
        "say": selected
    }

    actions.push(say);

    let respObj = {
        "actions": actions
    }

    callback(null, respObj);
}