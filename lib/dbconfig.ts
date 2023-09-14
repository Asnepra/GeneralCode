const config={
    server: "DESKTOP-817SO98",
    database: "CountryProfileDB",
    user: "sa",
    password: "ankit",
    //driver: "msnodesqlv8",
    options: {
      encrypt: false, // Set to true if you are using a secure connection (HTTPS)
      trustedConnection: true, // Set to true if you are using Windows Authentication
      instancename:'SQLEXPRESS'

    },
    port:52485
  
}



module.exports= config;