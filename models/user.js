module.exports = function(Sequelize,sequelize) {
	var User = sequelize.define('user', {
			id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
			firstname: { type: Sequelize.STRING,notEmpty: true},
			email: { type:Sequelize.STRING, validate: {isEmail:true} },
			password : {type: Sequelize.STRING,allowNull: false }
	});
	// force: true will drop the table if it already exists
	User.sync({force: false});

	return User;
};

