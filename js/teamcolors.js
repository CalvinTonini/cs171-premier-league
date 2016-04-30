/**
 * Created by Daniel on 4/27/16.
 */


var maincolor = d3.scale.ordinal();

maincolor.domain(['Arsenal', 'Aston Villa', 'Barnsley', 'Birmingham', 'Blackburn',
    'Blackpool', 'Bolton', 'Bournemouth', 'Bradford', 'Burnley',
    'Cardiff', 'Charlton', 'Chelsea', 'Coventry', 'Crystal Palace',
    'Derby', 'Everton', 'Fulham', 'Hull', 'Ipswich', 'Leeds',
    'Leicester', 'Liverpool', 'Man City', 'Man United',
    'Middlesbrough', 'Newcastle', 'Norwich', "Nottingham Forest", 'Oldham',
    'Portsmouth', 'QPR', 'Reading', 'Sheffield United',
    'Sheffield Weds', 'Southampton', 'Stoke', 'Sunderland', 'Swansea',
    'Swindon', 'Tottenham', 'Watford', 'West Brom', 'West Ham', 'Wigan',
    'Wimbledon', 'Wolves']);

maincolor.range(["#ef0107","#94bee5","#dd302c","#4c689f","#009ee0","#f68712","#263c7e","#000000","#fcb950","#8dd2f1","#005ea3",
    "#d4021d","#034694","#74b2df","#b62030","black","#274488","black","#f5a12d","#de23c7","#e1db20","#0053a0","#d00027","#5cbfeb","#da020e",
    "#d9000d","#231f20","#00a650","#e53233","#c1c1c1","#1e4494","#005cab","#dd1740","#ee2227","#377aaf","red","#e03a3e","red","black","#b48d00","#001c58","#000000",
    "#091453","#6022db","#006838","#fcd213","#faa61a"]);


var strokecolor = d3.scale.ordinal();

strokecolor.domain(['Arsenal', 'Aston Villa', 'Barnsley', 'Birmingham', 'Blackburn',
    'Blackpool', 'Bolton', 'Bournemouth', 'Bradford', 'Burnley',
    'Cardiff', 'Charlton', 'Chelsea', 'Coventry', 'Crystal Palace',
    'Derby', 'Everton', 'Fulham', 'Hull', 'Ipswich', 'Leeds',
    'Leicester', 'Liverpool', 'Man City', 'Man United',
    'Middlesbrough', 'Newcastle', 'Norwich', "Nottingham Forest", 'Oldham',
    'Portsmouth', 'QPR', 'Reading', 'Sheffield United',
    'Sheffield Weds', 'Southampton', 'Stoke', 'Sunderland', 'Swansea',
    'Swindon', 'Tottenham', 'Watford', 'West Brom', 'West Ham', 'Wigan',
    'Wimbledon', 'Wolves']);

strokecolor.range(["#9c824a","#ffe600","#996026","#f1f1f1","#e2001a","black","#df0024","#c51217","#84424a","#070e19","#b01b27",
    "#ffffff","#eee200","#04f482","#17519c","white","white","#cc0000","black","#3a64a3","#244593","#ffb556","#00a398","#ffce65","#ffe500",
    "#white","pink","#fff200","grey","#002f63","#e0e0ef","#d0d3ce","#004494","#ffffff","#e9aa3f","#ffffff","#ffffff","#ffffff","#ffffff","#db1116","#fffff","#fbee23",
    "#592d09","#f7c240","#1d59af","#2e3192","black"]);