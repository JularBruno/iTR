import path from 'path'

const settings = {
	token      : {
		secret:     'ts$s38*jsjmjnT1',
		expires:    '1d', // expires in 24 hours
		noexpires:  '100y', // expires in 100 years
	},
	crypto		 : {
		saltRounds : 12
	},
	baseUrl    : process.env.BASE_URL || 'http://localhost',
	uploadDir  : process.env.UPLOAD_DIR || '/tmp',
	files:{
		path: process.env.IMAGES_DIR || '../adm/files'
	},
	// imagesDir  : process.env.IMAGES_DIR || '../adm/files/',
	url        : function() {
		return this.baseUrl + ':' + this.port
	},
	path       : path.normalize(path.join(__dirname, '..')),
	port       : process.env.NODE_PORT || 8080,
	portHttps  : process.env.NODE_PORT_HTTPS || 4126,
	portSIO    : process.env.NODE_PORT_SIO || 10126,
	database   : {
		logging  : 'console.log',
		timezone : '-03:00',
		host     : 'localhost',
		name     : 'itr',
		itemsPerPage  : 20
	},
	mp : {
	  env: "dev", //"dev",
	  prod  : {
		  accessToken: "APP_USR-3604837006804538-020502-d8106928553fcd07fd6f7f931d6643c0-198521942"
	  },
	  dev : {
			accessToken: "TEST-3604837006804538-020502-6eab6ed4eb57390917dfc19e5259a06a-198521942"
	  },
		url : "https://api.mercadopago.com/v1",
		urlIpn : "https://vps-1060583-x.dattaweb.com:4092/api/mp/ipn"
	},
	bussinessRules: {
		
	},
	nodemailer: {
        transporter: {
            service: 'Gmail',
            auth: {
                user: 'diproachlabs@gmail.com',
                pass: 'granoL@bs'
            }
        },
        mailOptions:{
            from: 'Duzy',
            subject: 'Duzy subject',
        }
    }
}


module.exports = settings;
