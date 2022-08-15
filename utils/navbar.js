$(document).ready(function() {
    $("#search-bar").autocomplete({
        // source: the data (JSON, array, etc..) to autocomplete on (to match with the user's input)
        // in this case, the data is brought through a fetch function and saved in "results"
        source: async function(req, res) {
            let data = await fetch(`http://e-comwebsite.herokuapp.com/autocomplete?name=${$("#search-bar").val()}&option=${$("#option").val()}`)
                .then(results => results.json())
                .then(results => results.map(result => {
                    return {
                        label: result.name,
                    };
                }));
            res(data)
        },
        // OPTIONS
        //autoFocus: true,
        //delay: 0,
        minLength: 2 // min number of letters to start giving output
    });
});

$(document).ready(function() {
    $("#search-bar-mobile").autocomplete({
        source: async function(req, res) {
            let data = await fetch(`http://e-comwebsite.herokuapp.com/autocomplete?name=${$("#search-bar-mobile").val()}&option=${$("#option2").val()}`)
                .then(results => results.json())
                .then(results => results.map(result => {
                    return {
                        label: result.name,
                    };
                }));
            res(data);
        },
        minLength: 2,
    });
});