const express = require("express");
const app = express();
const connection = require("./connection.js");


// new stuff added in 
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// POST DATA
// 1) Middleware. What is it?  Those methods/functions/operations that are called BETWEEN processing the Request and 
// sending the Response in your application method.
// 2) You NEED express.urlencoded() for POST requests, because  A) you are sending data (in the form of some data object) to the 
// server and B) you are asking the server to accept or store that data (object), which is enclosed in the body (i.e. req.body) of the POST 
app.use(express.urlencoded({ extended: true }));


app.get("/", (req,res) => {
    res.render("index", { title : "My TV Shows" });
});



app.get("/", (req,res) => {
    res.send(`<h2>My TV</h2>`);
});









app.get("/select", (req,res) => {
    let readsql = `SELECT * FROM my_shows`;
    connection.query(readsql,(err, rows)=>{
        if(err) throw err;

        res.render('shows',{title: 'List of shows', rowdata: rows});
        // let stringdata = JSON.stringify(rows);
        // res.send(`<h2>My TV</h2> <code>${stringdata}</code>`);

       
    });
});


app.get("/row", (req,res) => {

    // NEW CODE
    // tvid - this appears at in the browser's url
    // tvid - is a query string parameter which is PASSED to the /rows route
    const showid = req.query.tvid;
    const readsql = ` SELECT * FROM my_shows WHERE id = ? `;

    connection.query(readsql, [showid], (err, rows) => {
        if(err) throw err;

        // NEW CODE
        // 1. we use the SQL query to return the row of data in the rows variable. The WHERE id means the clause only holds one row.
        // 2. Building an object called showData from the rows first item/index [0] to create keys and values.
        // 3. An object is then passed to the series.ejs, key is show with the showData as the value.

        const showData = { 
            name : rows[0]['showname'],
            imgp : rows[0]['imgpath'],
            details : rows[0]['descript']
        };     
        res.render("series", { show : showData} );

        // OLD CODE
        //res.send(` <h2>My TV</h2><code> ${rows[0].showname} </code> 
                   //<img src='${rows[0].imgpath}'> `);
    });


    //OLD CODE
    //const readsql = `SELECT * FROM my_shows;`;
   // connection.query(readsql,(err, rows)=>{
      //  if(err) throw err;
     //   res.send(`<h2>My TV</h2><code>${rows[1].showname}</code>
              //     <img src='${rows[1].imgpath}'>`);//
   // });
});




// POST DATA
// The route is admin/add therefore creating an extra directory for the browser/client needed in order to find the add route. 
// The res.render() function always makes the addtv.ejs to be the response of the web server.
app.get('/admin/add', (req, res) => {
    res.render("addtv");
});

// PROCESS THE POST
// 1) The app.post() means the server is allowing a POST ( e.g. <form method='POST'> ) to be processed by this function. 
// Please note, the route is allowed to be the same as the GET. 
// The request looks into the form with the name attribute  showField... ie - req.body.showField
// This is stored in a local JS variable called ==title== and sent to the browser.
app.post('/admin/add', (req, res) => {
    const title = req.body.showField;
    const imgp = req.body.imgField;
    const descr = req.body.desField;

    // OLD CODE
    // res.send(`You have not added ${title}, ${imgp} and ${descr}`);

    // NEW CODE
    // using an INSERT statement with placeholders for the values
    const createsql = `INSERT INTO my_shows (showname, imgpath, descript) 
                        VALUES( ? , ? , ?);` ;
    connection.query(createsql,[title, imgp, descr],(err, rows) => {
        if(err) throw err;
        res.send(`You have added::: <p>${title}</p> <p>${imgp}</p> <p>${descr}</p>`);
    });


});


app.listen(process.env.PORT || 3001, () => {
    console.log("Server is running at port 3001");
});