import { GoogleChartInterface } from 'ng2-google-charts';
import { DateWiseData } from './../../models/date-wise-data';
import { GlobalDataSummary } from './../../models/global-data';
import { DataServiceService } from './../../services/data-service.service';
import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {


  data : GlobalDataSummary[];
  countries : string[] = [];
  totalConfirmed = 0 ;
  totalActive = 0 ;
  totalDeaths = 0 ;
  totalRecovered = 0 ;
  datatable = [];
  selectedCountryData : DateWiseData[] ;
  dateWiseData ;
  loading = true ;
  
  lineChart : GoogleChartInterface = {
    chartType : 'LineChart'
  }
  constructor(private service : DataServiceService) { }

  ngOnInit(): void {

    merge(

      this.service.getDateWiseData().pipe(
        map(result =>{
          this.dateWiseData = result;

        })
        ),
        this.service.getGlobalData().pipe(
          map( result => {

            
          this.data = result ;
          this.data.forEach(cs => {
          this.countries.push(cs.country) ;

        })

          }))
    ).subscribe(

      {
        complete : () => {

          this.updateValues('India')
          this.loading = false ;

        }

      }
    )

    

    
  }

  updateChart()
  {
    let datatable = [] ;
    datatable.push(['Date' , 'Cases'])
    this.selectedCountryData.forEach(cs => {

      datatable.push([cs.date , cs.cases])
    })
    console.log(datatable);
    this.lineChart = {
      chartType: 'LineChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height : 500 ,
        animation:{
          duration: 1000,
          easing: 'out',
        },
      },
    };

  }


  updateValues(country : string)
  {
    console.log(country) ;
    this.data.forEach(cs => {
      if(cs.country == country)
      { 
       
        this.totalActive = cs.active 
        this.totalDeaths = cs.deaths
        this.totalRecovered = cs.recovered
        this.totalConfirmed = cs.confirmed 


      }

    })

      this.selectedCountryData = this.dateWiseData[country]
      // console.log(this.selectedCountryData) ;
      this.updateChart() ;
  }

}
