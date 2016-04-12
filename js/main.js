loadData();

function loadData () {
    d3.csv("data/matches.csv", function (error, csv) {
        console.log(csv);
    })
}