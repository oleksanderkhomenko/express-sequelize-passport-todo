module.exports = function(Sequelize,sequelize) {
	var List = sequelize.define('list', {
	  id: {
	    type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
	  },
	  user_id: Sequelize.INTEGER,
	  info: {
	    type: Sequelize.TEXT
	  }
	});
	// force: true will drop the table if it already exists
	List.sync({force: false});

	return List;
};

