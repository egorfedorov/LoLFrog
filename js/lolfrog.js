var Ability = Backbone.Model.extend({
	defaults: {
		name: '',
		description: '',
		cost: '',
		range: '',
		icon: '',
		isPassive: false,
	}
});

var Champion = Backbone.Model.extend({
	defaults: {
		name: '',
		lang: 'de',
		url: '',
		subtitle: '',
		attack: '',
		health: '',
		difficulty: '',
		spells: '',
		tags: [],
		description: '',
		icon: '',
		image: '',
		stats: {
			damage: '',
			damageInc: '', //increse per level
			health: '',
			healthInc: '',
			mana: '',
			manaInc: '',
			movespeed: '',
			armor: '',
			armorInc: '',
			spellblock: '',
			spellblockInc: '',
			healthregen: '',
			healthregenInc: '',
			manaregen: '',
			manaregenInc: '',
		},
		abilities: [],
		tips: [],
	}
});

var ChampionCollection = Backbone.Collection.extend({
	model: Champion,
	url: 'http://www.ninevillage.de/lolfrog/'
});

var ChampionView = Backbone.View.extend({
  tagName : "div",
  className : "champion",
 
  render : function() {
    this.el.innerHTML = this.model.get('name');
 
    return this;
  }
});

var UpdatingChampionView = ChampionView.extend({
  initialize : function(options) {
    this.render = _.bind(this.render, this);
 
    this.model.bind('change:name', this.render);
  }
});

var ChampionListView = Backbone.View.extend({

	//template:  _.template( $("#championListTemplate").html() ),

	initialize : function() {
		var that = this;
		this._championViews = [];

		this.collection.each(function(champion) {
			that._championViews.push(new UpdatingChampionView({
				model : champion,
				tagName : 'li'
			}));
		});
	},
	render : function() {
		var that = this;
		// Clear out this element.
		$(this.el).empty();

		// Render each sub-view and append it to the parent view's element.
		_(this._championViews).each(function(dv) {

			var template = _.template( $("#championListTemplate").html() );
			
			//$(that.el).append(dv.render().el);

			$(that.el).append(template(dv.model.toJSON())).listview('refresh').trigger('create');
		});
	}
});
 
$(document).bind("mobileinit", function() {
	$.mobile.page.prototype.options.addBackBtn = true;
});

Backbone.history.start();

var cs = new ChampionCollection;

cs.fetch({
	error: function() { console.log(arguments); },
	success: function() {
		var championCollectionView = new ChampionListView({
		  collection : cs,
		  el : $('ul.championList')[0]
		});
		championCollectionView.render();
		//$('ul#championList').listview('refresh').trigger('create')
	}
});

