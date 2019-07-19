import React from 'react';
import moment from 'moment';
import './style.css'; 
//import logo from './logo.svg';
 
  
export default class Calendar extends React.Component
{   	 
	constructor(props)
	{
		
		let events = 
		[
			{date: moment("2019-07-30"), events:[{name:'Race', body:'All-A-Toona Ride', time: '11:00'}]},		
			{date: moment("2019-07-25"), events:[{name:'Practice', body:'Sope Creek', time:'11:00'}]},		
			{date: moment("2019-07-26"), events:[{name:'Practice',  body:'Blanket\'s Greek', time:'10:00'},	
													{name:'Practice',  body:'Sope Greek', time:'11:00'},
													{name:'Practice', body:'Pine Mountain Overlook Loop', time:'14:00'}]},
			{date: moment("2019-07-28"), events:[{name:'Practice',  body:'Sope Creek', time:'14:00'}]} 				
		]; 
		
		
		super(props);
		this.state = { 
			now: moment(),
			date: moment(), 
			selectDate: moment(),
			week: false,
			addEvent: false, 
			containerEvents: [],
			validate: false,
			events: events
			
		}  
		this.goToPrev = this.goToPrev.bind(this);
		this.goToNext = this.goToNext.bind(this);  
		this.changeCalendarForMonth = this.changeCalendarForMonth.bind(this); 
		this.changeCalendarForWeek = this.changeCalendarForWeek.bind(this); 			
		this.panelShowHidden = this.panelShowHidden.bind(this); 	
		this.changeSelectDate = this.changeSelectDate.bind(this); 
		this.addEvent = this.addEvent.bind(this); 
		this.createNewEvent = this.createNewEvent.bind(this);  
		this.cancelCreateEvent = this.cancelCreateEvent.bind(this);   
		this.changeInputValue = this.changeInputValue.bind(this);
		
		}
	
	
	render() {  
			this.createKeys();  	
			this.createCalendar();				
			return (
					<div className="container">
					<table>
						<caption>			
							<div className="addEventContainer">{this.btEvent()}</div>
							<div className="navContainer"> 
							{this.btPrev()} 
								<button className="btnNavStyle"onClick={this.panelShowHidden}>
									<div className="month"> 
									{this.monthTitle()}  
										{this.btArrow()}
									</div>
								</button> 
								{this.btNext()} 				 				
							</div> 				
							<div id="panel" ref="panel" className="variatnsViewContainer hidden">
								<button className="btWeekMonthStyle" onClick={this.changeCalendarForWeek}>This week</button> 
								<button className="btWeekMonthStyle" onClick={this.changeCalendarForMonth}>This month</button>		
							</div> 
						</caption>
						<thead>
							<this.weekdays/>
						</thead>
						<tbody> 
							{this.rows}
						</tbody>			
					</table>
					<div className = "eventsContainer"> {this.state.containerEvents} </div>
					</div>)	
	}		

	addEvent()
	{
		this.setState({containerEvents:  []});
		this.setState({addEvent: true});
		this.setState({validate:false});	 
	}	
	cancelCreateEvent()
	{ 
		this.setState({addEvent: false});
	}
	
	createNewEvent()
	{		 	
		let events = this.state.events;
		let index = events.map(function(x) {return x.date.format("YYYY-MM-DD"); }).indexOf(this.refs['dateEvent'].value)
		if( index === -1 )
				events.push(
				{
					date: moment(this.refs['dateEvent'].value), 
					events: [{
						name:this.refs['nameEvent'].value, 
						body:this.refs['bodyEvent'].value, 
						time: this.refs['timeEvent'].value}
						]}
						) //то добавить дату и событие
		else
			events[index].events.push({name:this.refs['nameEvent'].value, body:this.refs['bodyEvent'].value, time: this.refs['timeEvent'].value})
		
		   
		  //сортируем массив событий по дате
		events.sort (function(a, b){  		
			return a["date"].diff(b["date"]);			
		});
		//сортируем массив событий по времени
		for (let i=0; i< Object.keys(events).length; i++)
		{
				let d = events[i].date.format("YYYY-MM-DD");
				events[i].events.sort (function(a, b) 	{   
					return (moment(d+' ' + a["time"])).diff(moment(d+' ' + b["time"]))					
				});
		}		   
		this.setState({events: events});
		this.setState({addEvent: false});  
	}
	
	changeSelectDate(event)
	{  
			console.log(this.state.date.get('date')+" " + this.state.date.get('month'));
			console.log(this.d.get('date')+" " + this.d.get('month'));
			console.log(this.state.selectDate.get('date')+" " + this.state.selectDate.get('month'));
			
		let elemNewSelect = document.getElementById(event.target.id);
			elemNewSelect.className +=' select';  		 
		this.d = moment([event.target.id.split('-')[2], event.target.id.split('-')[1], event.target.id.split('-')[0]]); 
		
		let dateTitle = [];
		let e = [];
		
		let  eventsArray = this.calendar[Number(event.target.id.split('-')[3])]
		
		if (typeof eventsArray.events[0] !== "undefined")
		{
			
			dateTitle.push((
							<div key={this.numbers.pop()} className="dateContainer">
								{moment.weekdays(eventsArray.date.get('day'))+', ' + 
								eventsArray.date.get('date') + ' ' +
								moment.months(eventsArray.date.get('month'))}
							</div>));
			
			
			let className = "eventContent";
			
			
			for(let i=0; i<eventsArray.events.length; i++)
			{				 
				 if (i%2 !== 0)
					className = "eventContent greyBg";
				
				e.push((
					<div key={this.numbers.pop()} className="eventTitle">
							<div >{eventsArray.events[i].name}</div>
							<div >{eventsArray.events[i].time}</div>
						   </div>));
						
				e.push((
					<div key={this.numbers.pop()}>
						{eventsArray.events[i].body}
					</div>));
					
			  
				dateTitle.push((<div key={this.numbers.pop()} className={className}>{e}</div>));
				e = [];
				className = "eventContent";
			}
		} 
		this.setState({containerEvents: dateTitle});
		this.setState({selectDate: this.d});	
		this.setState({date: this.d.clone()});
	} 
 
	changeInputValue()
	{		
		if (this.refs['nameEvent'].value !== '' &&
			this.refs['bodyEvent'].value !== '' &&
			this.refs['dateEvent'].value !== '' &&
			this.refs['timeEvent'].value !== '' 
		)		
			this.setState({validate:true});
		
		else
	 		this.setState({validate:false});
	 
	}
	createForAddEvent()
	{   		
		this.rows.push((
		<tr key={this.numbers.pop()}>
			<td className="inputContainer">
				<label>Event Name
					<input type="text" id="nameEvent" ref="nameEvent"  onChange={this.changeInputValue} />
				</label>
			</td>
		</tr>)); 		
		
		this.rows.push((
		<tr key={this.numbers.pop()}>
			<td className="inputContainer">
				<label>Details
					<input type="text" id="bodyEvent" ref="bodyEvent" onChange={this.changeInputValue} />
				</label>
			</td>
		</tr>)); 		
		
		this.rows.push((
		<tr key={this.numbers.pop()}>
			<td className="inputContainer">
				<label htmlFor ="dateEvent">Starts</label>
					<input type="date" defaultValue={this.state.selectDate.format('YYYY-MM-DD')} ref="dateEvent"  id="dateEvent" className="dateEvent"  onChange={this.changeInputValue} />
					<label htmlFor ="timeEvent">at</label>
					<input type="time"  ref="timeEvent" id="timeEvent" defaultValue={this.state.selectDate.format('HH:mm')}  onChange={this.changeInputValue} />				 				
			</td>
		</tr>));  
	}
	 
	 
	createCalendar() 
	{     
		this.calendar = [];
		this.rows = [];				
		this.d = moment(this.state.date); 
		let cols = [];	 	 
		let classTd = "";  
		let classDay = "day";
		
		//если календарь в режиме "добавить новое событие" то отображаем поля для добавления нового события
		if(this.state.addEvent === true) 
			this.createForAddEvent();
		else
		{ 	 
			//если календарь в режиме "отобразить неделю", то отображаем календарь на неделю
			if(this.state.week === true) 
			{			
				while(this.d.weekday()>0)
					this.d.subtract(1, 'days');			 
						
				for (let i=0; i<7; i++)
				{   
					let _date = this.d.clone();								
					let index = this.state.events.map(function(x) {return x.date.format("YYYY-MM-DD"); }).indexOf(_date.format("YYYY-MM-DD")) 
							
					if( index === -1 )
						this.calendar.push({date:_date, events: []});
					else 
						this.calendar.push({date:_date, events: this.state.events[index].events}); 
							
					this.d.add(1, 'days');
				}  
						
				 for (let i=0; i<this.calendar.length; i++) 
					this.createWeek(i, cols, classDay, classTd);  						 
			}
			//иначе отображаем календарь на месяц
			else 
			{ 
				this.d.startOf('month');	 
				while (this.d.get('month') === this.state.date.get('month')) 
				{   	
					let _date = this.d.clone();				
					let index = this.state.events.map(function(x) {return x.date.format("YYYY-MM-DD"); }).indexOf(_date.format("YYYY-MM-DD")) 
					
					if( index === -1 )
						this.calendar.push({date:_date, events: []});
					else 
						this.calendar.push({date:_date, events: this.state.events[index].events});
					 
					this.d.add(1, 'days');			      
				}     
			this.d = this.state.date.clone(); 			
			
			for (let i = 0; i < this.calendar[0].date.weekday(); i++)  
				cols.push((
						<td key={this.numbers.pop()}>
							<div>
								<span>
								</span>
							</div>
						</td>));							
		 
			for (let i=0; i<this.calendar.length; i++) 
			{   			
				this.createWeek(i, cols, classDay, classTd); 
				if (this.calendar[i].date.weekday() === 6) 
				{
					this.rows.push((<tr key={this.numbers.pop()}>{cols}</tr>)); 
					cols = [];
				}   
			}   			 
			
			for(let i=0; i < 6-this.calendar[this.calendar.length-1].date.isoWeekday(); i++) 
				cols.push((
						<td key={this.numbers.pop()}>
							<div>
								<span>
								</span>
							</div>
						</td>));			 
			}			
			
			this.rows.push((<tr key={this.numbers.pop()}>{cols}</tr>));
		}
	}
	
	 createWeek(i, cols, classDay, classTd)
	 {
		 if (this.calendar[i].date.weekday()===0 || this.calendar[i].date.weekday()===6) 	//если текущий день - это выходной день	 
				classTd = "weekends";		
		if (this.calendar[i].date.get('date')  === this.state.selectDate.get('date') && //если текущий день это выбранный день
			this.calendar[i].date.get('month')  === this.state.selectDate.get('month') &&
			this.calendar[i].date.get('year')  === this.state.selectDate.get('year'))  
				classDay+=' select';
		if (this.calendar[i].date.get('date')  === this.state.now.get('date') && //если текущий день это сегодня
			this.calendar[i].date.get('month')  === this.state.now.get('month') &&
			this.calendar[i].date.get('year')  === this.state.now.get('year')) 
				classDay+=' today';   
		if (typeof this.calendar[i].events[0] !== "undefined")
				classDay+=' event'; 
		
		let id = this.calendar[i].date.get('date') + '-' + this.calendar[i].date.get('month') + '-' + this.calendar[i].date.get('year')+'-'+i
			cols.push ((
						<td key={this.numbers.pop()} className={classTd}>
							<div className={classDay} id = {id} onClick={this.changeSelectDate}>
								 {this.calendar[i].date.get('date')}
							</div>
						</td>));	
		classDay = "day";
		classTd = "";  
	 }
	
	   
	 btPrev (){ 
	 
		return ( 		
				this.state.addEvent === true? 	 
				
					(<button className="btnAddEvent btCnl" onClick={this.cancelCreateEvent}></button>) :
					
					(<button className="btnNavStyle" onClick={this.goToPrev}>
						{(this.state.week === true? "prev" :  this.d.subtract(1, 'months').format('MMM'))}
					</button>)
				)
					
					 
    } 
	
	btNext () { 	
	
	let btClass= this.state.validate === false? "btnAddEvent btOkD" : "btnAddEvent btOk" ;
	let isDisabled = this.state.validate === false? true : false;
	   return (
				this.state.addEvent === true?
			
					(<button disabled={isDisabled} className={btClass} id="btOk" onClick={this.createNewEvent}></button>) :  
				
					(<button className="btnNavStyle" onClick={this.goToNext}>
						{(this.state.week === true? "next" : this.d.add(1, 'month').format('MMM'))}
					</button>)
				)
    }
	
	
	monthTitle (){	 	
	  
	   return 	(
					this.state.addEvent === true? 
					(<div> New Event</div>) 
					:
					(this.state.week === true? this.state.date.add(0, 'month').format('MMMM') : this.d.add(1, 'month').format('MMMM'))
				)
	}
	
	btArrow () {
		 return (
					this.state.addEvent === true? 
					(<div></div>) 
					: 
					(<div className="arrow"></div>)				
				)
	}
	    
    btEvent (){	 	
	
	   return 	(
					this.state.addEvent === false? 
					(<button className="btAddEvent" onClick={this.addEvent}>+</button>) :
					(<div></div>)				
				)
	}
	
	  changeCalendarForWeek()
	  {
		  if(this.state.week !== true)
			  this.setState({week: true});
			this.panelShowHidden();
	  }
	  
	  changeCalendarForMonth()
	  {
		  if(this.state.week !== false)
			this.setState({week: false});	 
		 this.panelShowHidden();
	  }
	 
	weekdays = () => {
		
		 let i, n;
		 i = n = 0; 
		 let col = [];
		 
		 while(i<=6)
			 col.push((<th key={this.numbers.pop()}>{moment.weekdaysShort(i++)[n]}</th>));
		 
		 return (
					this.state.addEvent === false?  (
					<tr>{col}</tr>) 
					:
					(<tr></tr>)
				) 
	}
	 
	
	
	goToPrev() 
	{  
		if (this.state.week === true)  
			this.setState({date: this.state.date.subtract(this.state.date.weekday()+1, 'days')});
		 	
		else {
			if (this.state.date.get('month') === 0) 
			{
				this.setState({date: this.state.date.set('month', 11)});
				this.setState({date: this.state.date.set('year', this.state.date.get('year')-1)});
			}
			else 
				this.setState({date: this.state.date.set('month', this.state.date.get('month')-1)}); 
			this.setState({date:  this.state.date.endOf('month')}); 
		} 
	}
	 
	goToNext() 
	{  
		if (this.state.week===true) 
		 
			this.setState({date: this.state.date.add(7-this.state.date.weekday(), 'days')});	
	 
		else 
		{
			if (this.state.date.get('month') === 11) 
			{
				this.setState({date: this.state.date.set('month', 0)});
				this.setState({date: this.state.date.set('year', this.state.date.get('year')+1)});
			}
			else 
				this.setState({date: this.state.date.set('month', this.state.date.get('month')+1)}); 
			this.setState({date: this.state.date.set('date', 1)}); 
		}  
	}
	 
	createKeys() 
	{
		this.numbers = [];	
		for (let i=1; i<150; i++) 
			this.numbers.push(i) 
	}
	
	panelShowHidden() 
	{  
		let elem = this.refs['panel'];  
		if ( elem.className === 'variatnsViewContainer show')
			elem.className = 'variatnsViewContainer hidden';
		else
			elem.className = 'variatnsViewContainer show';			 
	}
}
 

/*
 import React from 'react';
import moment from 'moment';
import './style.css'; 
//import logo from './logo.svg';
 
  
export default class Calendar extends React.Component
{   	 
	constructor(props)
	{
		
		let events = 
		[
			{date: moment("2019-07-30"), events:[{name:'Race', body:'All-A-Toona Ride', time: '11:00'}]},		
			{date: moment("2019-07-25"), events:[{name:'Practice', body:'Sope Creek', time:'11:00'}]},		
			{date: moment("2019-07-26"), events:[{name:'Practice',  body:'Blanket\'s Greek', time:'10:00'},	
													{name:'Practice',  body:'Sope Greek', time:'11:00'},
													{name:'Practice', body:'Pine Mountain Overlook Loop', time:'14:00'}]},
			{date: moment("2019-07-28"), events:[{name:'Practice',  body:'Sope Creek', time:'14:00'}]} 				
		]; 
		
		
		super(props);
		this.state = { 
			now: moment(),
			date: moment(), 
			selectDate: moment(),
			week: false,
			addEvent: false, 
			containerEvents: [],
			validate: false,
			events: events
			
		}  
		this.goToPrev = this.goToPrev.bind(this);
		this.goToNext = this.goToNext.bind(this);  
		this.changeCalendarForMonth = this.changeCalendarForMonth.bind(this); 
		this.changeCalendarForWeek = this.changeCalendarForWeek.bind(this); 			
		this.panelShowHidden = this.panelShowHidden.bind(this); 	
		this.changeSelectDate = this.changeSelectDate.bind(this); 
		this.addEvent = this.addEvent.bind(this); 
		this.createNewEvent = this.createNewEvent.bind(this);  
		this.cancelCreateEvent = this.cancelCreateEvent.bind(this);   
		this.changeInputValue = this.changeInputValue.bind(this);
		
		}
	
	
	render() {  
			this.createKeys();  	
			this.createCalendar();				
			return (
					<div className="container">
					<table>
						<caption>			
						<div className="addEventContainer"><this.btEvent/></div>
							<div className="navContainer"> 
							<this.btPrev/> 
								<button className="btnNavStyle"onClick={this.panelShowHidden}>
									<div className="month"> 
										<this.monthTitle/> 
										<this.btArrow/>
									</div>
								</button> 
								<this.btNext/> 				 				
							</div> 				
							<div id="panel" ref="panel" className="variatnsViewContainer hidden">
								<button className="btWeekMonthStyle" onClick={this.changeCalendarForWeek}>This week</button> 
								<button className="btWeekMonthStyle" onClick={this.changeCalendarForMonth}>This month</button>		
							</div> 
						</caption>
						<thead>
							<this.weekdays/>
						</thead>
						<tbody> 
							{this.rows}
						</tbody>			
					</table>
					<div className = "eventsContainer"> {this.state.containerEvents} </div>
					</div>)	
	}		

	addEvent()
	{
		this.setState({containerEvents:  []});
		this.setState({addEvent: true});
		this.setState({validate:false});	 
	}	
	cancelCreateEvent()
	{ 
		this.setState({addEvent: false});
	}
	
	createNewEvent()
	{		 	
		let events = this.state.events;
		let index = events.map(function(x) {return x.date.format("YYYY-MM-DD"); }).indexOf(this.refs['dateEvent'].value)
		if( index === -1 )
				events.push(
				{
					date: moment(this.refs['dateEvent'].value), 
					events: [{
						name:this.refs['nameEvent'].value, 
						body:this.refs['bodyEvent'].value, 
						time: this.refs['timeEvent'].value}
						]}
						) //то добавить дату и событие
		else
			events[index].events.push({name:this.refs['nameEvent'].value, body:this.refs['bodyEvent'].value, time: this.refs['timeEvent'].value})
		
		   
		  //сортируем массив событий по дате
		events.sort (function(a, b){  		
			return a["date"].diff(b["date"]);			
		});
		//сортируем массив событий по времени
		for (let i=0; i< Object.keys(events).length; i++)
		{
				let d = events[i].date.format("YYYY-MM-DD");
				events[i].events.sort (function(a, b) 	{   
					return (moment(d+' ' + a["time"])).diff(moment(d+' ' + b["time"]))					
				});
		}		   
		this.setState({events: events});
		this.setState({addEvent: false});  
	}
	
	changeSelectDate(event)
	{  
			console.log(this.state.date.get('date')+" " + this.state.date.get('month'));
			console.log(this.d.get('date')+" " + this.d.get('month'));
			console.log(this.state.selectDate.get('date')+" " + this.state.selectDate.get('month'));
			
		let elemNewSelect = document.getElementById(event.target.id);
			elemNewSelect.className +=' select';  		 
		this.d = moment([event.target.id.split('-')[2], event.target.id.split('-')[1], event.target.id.split('-')[0]]); 
		
		let dateTitle = [];
		let e = [];
		
		let  eventsArray = this.calendar[Number(event.target.id.split('-')[3])]
		
		if (typeof eventsArray.events[0] !== "undefined")
		{
			
			dateTitle.push(
							<div key={this.numbers.pop()} className="dateContainer">
								{moment.weekdays(eventsArray.date.get('day'))+', ' + 
								eventsArray.date.get('date') + ' ' +
								moment.months(eventsArray.date.get('month'))}
							</div>);
			
			
			let className = "eventContent";
			
			
			for(let i=0; i<eventsArray.events.length; i++)
			{				 
				 if (i%2 !== 0)
					className = "eventContent greyBg";
				
				e.push(
					<div key={this.numbers.pop()} className="eventTitle">
							<div >{eventsArray.events[i].name}</div>
							<div >{eventsArray.events[i].time}</div>
						   </div>);
						
				e.push(
					<div key={this.numbers.pop()}>
						{eventsArray.events[i].body}
					</div>);
					
			  
				dateTitle.push(<div key={this.numbers.pop()} className={className}>{e}</div>);
				e = [];
				className = "eventContent";
			}
		} 
		this.setState({containerEvents: dateTitle});
		this.setState({selectDate: this.d});	
		this.setState({date: this.d.clone()});
	} 
 
	changeInputValue()
	{		
		if (this.refs['nameEvent'].value !== '' &&
			this.refs['bodyEvent'].value !== '' &&
			this.refs['dateEvent'].value !== '' &&
			this.refs['timeEvent'].value !== '' 
		)		
			this.setState({validate:true});
		
		else
	 		this.setState({validate:false});
	 
	}
	createForAddEvent()
	{   		
		this.rows.push(
		<tr key={this.numbers.pop()}>
			<td className="inputContainer">
				<label>Event Name
					<input type="text" id="nameEvent" ref="nameEvent"  onChange={this.changeInputValue} />
				</label>
			</td>
		</tr>); 		
		
		this.rows.push(
		<tr key={this.numbers.pop()}>
			<td className="inputContainer">
				<label>Details
					<input type="text" id="bodyEvent" ref="bodyEvent" onChange={this.changeInputValue} />
				</label>
			</td>
		</tr>); 		
		
		this.rows.push(
		<tr key={this.numbers.pop()}>
			<td className="inputContainer">
				<label htmlFor ="dateEvent">Starts</label>
					<input type="date" defaultValue={this.state.selectDate.format('YYYY-MM-DD')} ref="dateEvent"  id="dateEvent" className="dateEvent"  onChange={this.changeInputValue} />
					<label htmlFor ="timeEvent">at</label>
					<input type="time"  ref="timeEvent" id="timeEvent" defaultValue={this.state.selectDate.format('HH:mm')}  onChange={this.changeInputValue} />				 				
			</td>
		</tr>);  
	}
	
 
	 
	
	 
	createCalendar() 
	{     
		this.calendar = [];
		this.rows = [];				
		this.d = moment(this.state.date); 
		let cols = [];	 	 
		let classTd = "";  
		let classDay = "day";
		
		//если календарь в режиме "добавить новое событие" то отображаем поля для добавления нового события
		if(this.state.addEvent === true) 
			this.createForAddEvent();
		else
		{ 	 
			//если календарь в режиме "отобразить неделю", то отображаем календарь на неделю
			if(this.state.week === true) 
			{			
				while(this.d.weekday()>0)
					this.d.subtract(1, 'days');			 
						
				for (let i=0; i<7; i++)
				{   
					let _date = this.d.clone();								
					let index = this.state.events.map(function(x) {return x.date.format("YYYY-MM-DD"); }).indexOf(_date.format("YYYY-MM-DD")) 
							
					if( index === -1 )
						this.calendar.push({date:_date, events: []});
					else 
						this.calendar.push({date:_date, events: this.state.events[index].events}); 
							
					this.d.add(1, 'days');
				}  
						
				 for (let i=0; i<this.calendar.length; i++) 
					this.createWeek(i, cols, classDay, classTd);  						 
			}
			//иначе отображаем календарь на месяц
			else 
			{ 
				this.d.startOf('month');	 
				while (this.d.get('month') === this.state.date.get('month')) 
				{   	
					let _date = this.d.clone();				
					let index = this.state.events.map(function(x) {return x.date.format("YYYY-MM-DD"); }).indexOf(_date.format("YYYY-MM-DD")) 
					
					if( index === -1 )
						this.calendar.push({date:_date, events: []});
					else 
						this.calendar.push({date:_date, events: this.state.events[index].events});
					 
					this.d.add(1, 'days');			      
				}     
			this.d = this.state.date.clone(); 			
			
			for (let i = 0; i < this.calendar[0].date.weekday(); i++)  
				cols.push(
						<td key={this.numbers.pop()}>
							<div>
								<span>
								</span>
							</div>
						</td>);							
		 
			for (let i=0; i<this.calendar.length; i++) 
			{   			
				this.createWeek(i, cols, classDay, classTd); 
				if (this.calendar[i].date.weekday() === 6) 
				{
					this.rows.push(<tr key={this.numbers.pop()}>{cols}</tr>); 
					cols = [];
				}   
			}   			 
			
			for(let i=0; i < 6-this.calendar[this.calendar.length-1].date.isoWeekday(); i++) 
				cols.push(
						<td key={this.numbers.pop()}>
							<div>
								<span>
								</span>
							</div>
						</td>);			 
			}			
			
			this.rows.push(<tr key={this.numbers.pop()}>{cols}</tr>);
		}
	}
	
	 createWeek(i, cols, classDay, classTd)
	 {
		 if (this.calendar[i].date.weekday()===0 || this.calendar[i].date.weekday()===6) 	//если текущий день - это выходной день	 
				classTd = "weekends";		
		if (this.calendar[i].date.get('date')  === this.state.selectDate.get('date') && //если текущий день это выбранный день
			this.calendar[i].date.get('month')  === this.state.selectDate.get('month') &&
			this.calendar[i].date.get('year')  === this.state.selectDate.get('year'))  
				classDay+=' select';
		if (this.calendar[i].date.get('date')  === this.state.now.get('date') && //если текущий день это сегодня
			this.calendar[i].date.get('month')  === this.state.now.get('month') &&
			this.calendar[i].date.get('year')  === this.state.now.get('year')) 
				classDay+=' today';   
		if (typeof this.calendar[i].events[0] !== "undefined")
				classDay+=' event'; 
		
		let id = this.calendar[i].date.get('date') + '-' + this.calendar[i].date.get('month') + '-' + this.calendar[i].date.get('year')+'-'+i
			cols.push (
						<td key={this.numbers.pop()} className={classTd}>
							<div className={classDay} id = {id} onClick={this.changeSelectDate}>
								 {this.calendar[i].date.get('date')}
							</div>
						</td>);	
		classDay = "day";
		classTd = "";  
	 }
	
	   
	 btPrev = () => { 
	 
		return ( 		
				this.state.addEvent === true? 	 
				
					(<button className="btnAddEvent btCnl" onClick={this.cancelCreateEvent}></button>) :
					
					(<button className="btnNavStyle" onClick={this.goToPrev}>
						{(this.state.week === true? "prev" :  this.d.subtract(1, 'months').format('MMM'))}
					</button>)
				)
					
					 
    } 
	
	btNext = () => { 	
	
	let btClass= this.state.validate === false? "btnAddEvent btOkD" : "btnAddEvent btOk" ;
	let isDisabled = this.state.validate === false? true : false;
	   return (
				this.state.addEvent === true?
			
					(<button disabled={isDisabled} className={btClass} id="btOk" onClick={this.createNewEvent}></button>) :  
				
					(<button className="btnNavStyle" onClick={this.goToNext}>
						{(this.state.week === true? "next" : this.d.add(1, 'month').format('MMM'))}
					</button>)
				)
    }
	
	
	monthTitle = () => {	 	
	 
	   return 	(
					this.state.addEvent === true? 
					(<div> New Event</div>) 
					:
					(<div>
						{this.state.week === true? this.state.date.add(0, 'month').format('MMMM') : this.d.add(1, 'month').format('MMMM')}
					</div>)				
				)
	}
	
	btArrow = () =>{
		 return (
					this.state.addEvent === true? 
					(<div></div>) 
					: 
					(<div className="arrow"></div>)				
				)
	}
	    
    btEvent = () => {	 	
	
	   return 	(
					this.state.addEvent === false? 
					(<button className="btAddEvent" onClick={this.addEvent}>+</button>) :
					(<div></div>)				
				)
	}
	
	  changeCalendarForWeek()
	  {
		  if(this.state.week !== true)
			  this.setState({week: true});
			this.panelShowHidden();
	  }
	  
	  changeCalendarForMonth()
	  {
		  if(this.state.week !== false)
			this.setState({week: false});	 
		 this.panelShowHidden();
	  }
	 
	weekdays = () => {
		
		 let i, n;
		 i = n = 0; 
		 let col = [];
		 
		 while(i<=6)
			 col.push(<th key={this.numbers.pop()}>{moment.weekdaysShort(i++)[n]}</th>)
		 
		 return (
					this.state.addEvent === false?  (
					<tr>{col}</tr>) 
					:
					(<tr></tr>)
				) 
	}
	 
	
	
	goToPrev() 
	{  
		if (this.state.week === true)  
			this.setState({date: this.state.date.subtract(this.state.date.weekday()+1, 'days')});
		 	
		else {
			if (this.state.date.get('month') === 0) 
			{
				this.setState({date: this.state.date.set('month', 11)});
				this.setState({date: this.state.date.set('year', this.state.date.get('year')-1)});
			}
			else 
				this.setState({date: this.state.date.set('month', this.state.date.get('month')-1)}); 
			this.setState({date:  this.state.date.endOf('month')}); 
		} 
	}
	 
	goToNext() 
	{  
		if (this.state.week===true) 
		 
			this.setState({date: this.state.date.add(7-this.state.date.weekday(), 'days')});	
	 
		else 
		{
			if (this.state.date.get('month') === 11) 
			{
				this.setState({date: this.state.date.set('month', 0)});
				this.setState({date: this.state.date.set('year', this.state.date.get('year')+1)});
			}
			else 
				this.setState({date: this.state.date.set('month', this.state.date.get('month')+1)}); 
			this.setState({date: this.state.date.set('date', 1)}); 
		}  
	}
	 
	createKeys() 
	{
		this.numbers = [];	
		for (let i=1; i<150; i++) 
			this.numbers.push(i) 
	}
	
	panelShowHidden() 
	{  
		let elem = this.refs['panel'];  
		if ( elem.className === 'variatnsViewContainer show')
			elem.className = 'variatnsViewContainer hidden';
		else
			elem.className = 'variatnsViewContainer show';			 
	}
}

*/