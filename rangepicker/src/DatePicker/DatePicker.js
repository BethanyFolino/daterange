import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './DatePicker.css';

let inputRef = React.createRef();
let inputRefTwo = React.createRef();

export default class DatePicker extends Component {

    state = {
        getMonthDetails: []
    }

    constructor() {
        super();
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        this.state = {
            year,
            month,
            selectedDay: inputRef,
            selectedDayTwo: inputRefTwo,
            monthDetails: this.getMonthDetails(year, month)
        }
    }

    componentDidMount() {
        window.addEventListener('click', this.addBackDrop);
        this.setDateToInput(this.state.selectedDay);
        this.setDateToInput(this.state.selectedDayTwo);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.addBackDrop);
    }

    addBackDrop =e=> {
        if(this.state.showDatePicker && !ReactDOM.findDOMNode(this).contains(e.target)) {
            this.showDatePicker(false);
        }
    }

    showDatePicker =(showDatePicker=true)=> {
        this.setState({ showDatePicker })
    }

   // Core
    daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    getDayDetails =args=> {
        let date = args.index - args.firstDay; 
        let day = args.index%7;
        let prevMonth = args.month-1;
        let prevYear = args.year;
        if(prevMonth < 0) {
            prevMonth = 11;
            prevYear--;
        }
        let prevMonthNumberOfDays = this.getNumberOfDays(prevYear, prevMonth);
        let _date = (date < 0 ? prevMonthNumberOfDays+date : date % args.numberOfDays) + 1;
        let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
        let timestamp = new Date(args.year, args.month, _date).getTime();
        return {
            date: _date,
            day,
            month, 
            timestamp,
            dayString: this.daysMap[day]
        }
    }

    getNumberOfDays =(year, month)=> {
        return 40 - new Date(year, month, 40).getDate();
    }

    getMonthDetails =(year, month)=> {
        let firstDay = (new Date(year, month)).getDay();
        let numberOfDays = this.getNumberOfDays(year, month);
        let monthArray = [];
        let rows = 6;
        let currentDay = null;
        let index = 0; 
        let cols = 7;

        for(let row=0; row<rows; row++) {
            for(let col=0; col<cols; col++) { 
                currentDay = this.getDayDetails({
                    index,
                    numberOfDays,
                    firstDay,
                    year,
                    month
                });
                monthArray.push(currentDay);
                index++;
            }
        }
        return monthArray;
    }

    isStartDay =day=> {
        return day.timestamp === this.state.selectedDay;
    }

    // An attempt to get the end day to highlight if there is already a start day
    isEndDay =day=> {
        if(this.isStartDay) {
            return day.timestamp === this.state.selectedDayTwo;
        }
        
    }

    // An attempt to get the days between the start and end date to be highlighted
    isBetweenDays =day=> {
        if(this.isStartDay() && this.isEndDay()) {
            return day.timestamp === this.state.isBetweenDays;
        }
    }

    getDateFromDateString =dateValue=> {
        let dateData = dateValue.split('-').map(d=>parseInt(d, 10));
        if(dateData.length < 3) {
            return null;
        }

        let year = dateData[0];
        let month = dateData[1];
        let date = dateData[2];
        return {year, month, date};
    }

    getDateFromDateStringTwo =dateValueTwo=> {
        let dateDataTwo = dateValueTwo.split('-').map(d=>parseInt(d, 10));
        if(dateDataTwo.length < 3) {
            return null;
        }

        let year = dateDataTwo[0];
        let month = dateDataTwo[1];
        let date = dateDataTwo[2];
        return {year, month, date};
    }

    getMonthStr =month=> this.monthMap[Math.max(Math.min(11, month), 0)] || 'Month';

    getDateStringFromTimestamp =timestamp=> {
        let dateObject = new Date(timestamp);
        let month = dateObject.getMonth()+1;
        let date = dateObject.getDate();
        return dateObject.getFullYear() + '-' + (month < 10 ? '0'+month : month) + '-' + (date < 10 ? '0'+date : date);
    }

    getDateStringFromTimestampTwo =timestamp=> {
        let dateObjectTwo = new Date(timestamp);
        let monthTwo = dateObjectTwo.getMonth()+1;
        let dateTwo = dateObjectTwo.getDate();
        return dateObjectTwo.getFullYear() + '-' + (monthTwo < 10 ? '0'+monthTwo : monthTwo) + '-' + (dateTwo < 10 ? '0'+dateTwo : dateTwo);
    }

    setDate =dateData=> {
        let selectedDay = new Date(dateData.year, dateData.month-1, dateData.date).getTime();
        this.setState({ selectedDay })
        if(this.props.onChange) {
            this.props.onChange(selectedDay);
        }

        let selectedDayTwo = new Date(dateData.year, dateData.month-1, dateData.date).getTime();
        this.setState({ selectedDayTwo })
        if(this.props.onChange) {
            this.props.onChange(selectedDayTwo)
        }
    }

    updateDateFromInput =()=> {
        let dateValue = inputRef.current.value;
        let dateData = this.getDateFromDateString(dateValue);
        let dateValueTwo = inputRefTwo.current.value;
        let dateDataTwo = this.getDateFromDateStringTwo(dateValueTwo);

        if(dateData !== null) { 
            this.setDate(dateData);
            this.setState({ 
                year: dateData.year, 
                month: dateData.month-1, 
                monthDetails: this.getMonthDetails(dateData.year, dateData.month-1)
            })
        }

        if(dateDataTwo !== null) {
            this.setDate(dateDataTwo);
            this.setState({
                year: dateDataTwo.year,
                month: dateDataTwo.month-1,
                monthDetails: this.getMonthDetails(dateData.month.year, dateDataTwo.month-1)
            })
        }
    }

    setDateToInput =(timestamp)=> {
        let dateString = this.getDateStringFromTimestamp(timestamp);
        let dateStringTwo = this.getDateStringFromTimestampTwo(timestamp);
        inputRef.current.value = dateString;
        inputRefTwo.current.value = dateStringTwo;
    }

    onDateClick =day=> {
        this.setState({selectedDay: day.timestamp}, ()=>this.setDateToInput(day.timestamp));
        if(this.props.onChange) {
            this.props.onChange(day.timestamp);
        }
    }

    setYear =offset=> {
        let year = this.state.year + offset;
        let month = this.state.month;
        this.setState({ 
            year,
            monthDetails: this.getMonthDetails(year, month)
        })
    }

    setMonth =offset=> {
        let year = this.state.year;
        let month = this.state.month + offset;
        if(month === -1) {
            month = 11;
            year--;
        } else if(month === 12) {
            month = 0;
            year++;
        }
        this.setState({ 
            year, 
            month,
            monthDetails: this.getMonthDetails(year, month)
        })
    }

    // Renderers
    renderCalendar() {
        let days = this.state.monthDetails.map((day, index)=> {
            return (
                <div className={'c-day-container ' + (day.month !== 0 ? ' disabled' : '') + 
                    (this.isStartDay(day) ? ' highlight' : '') + (this.isEndDay(day) ? ' highlight' : '')} key={index}>
                    <div className='cdc-day'>
                        <span onClick={()=>this.onDateClick(day)}>
                            {day.date}
                        </span>
                    </div>
                </div>
            )
        })

        return (
            <div className='c-container'>
                <div className='cc-head'>
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d,i)=><div key={i} className='cch-name'>{d}</div>)}
                </div>
                <div className='cc-body'>
                    {days}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className='DatePicker'>
                <div className='mdp-input'  onClick={()=> this.showDatePicker(true)}>
                    <input type='date' onChange={this.updateDateFromInput} ref={inputRef}/>
                </div>
                <div className='mdp-input'  onClick={()=> this.showDatePicker(true)}>
                    <input type='date' onChange={this.updateDateFromInput} ref={inputRefTwo}/>
                </div>
                {this.state.showDatePicker ? (
                    <div className='mdp-container'>
                        <div className='mdpc-head'>
                            <div className='mdpch-container'>
                                <div className='mdpchc-year'>{this.state.year}</div>
                                <div className='mdpchc-month'>{this.getMonthStr(this.state.month)}</div>
                            </div>
                            <div className='mdpch-button'>
                                <div className='mdpchb-inner' onClick={()=> this.setMonth(-1)}>
                                    <span className='mdpchbi-left-arrow'></span>
                                </div>
                            </div>
                            <div className='mdpch-button'>
                                <div className='mdpchb-inner' onClick={()=> this.setMonth(+1)}>
                                    <span className='mdpchbi-right-arrow'></span>
                                </div>
                            </div>
                        </div>
                        <div className='mdpc-body'>
                            {this.renderCalendar()}
                        </div>
                    </div>
                ) : ''}
            </div>
        )
    }

}