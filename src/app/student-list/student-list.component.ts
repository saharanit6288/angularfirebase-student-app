import { Component, OnInit } from '@angular/core';
import { CrudService } from '../shared/crud.service';  // CRUD API service class
import { Student } from '../shared/student';   // Student interface class for Data types.
import { ToastrService } from 'ngx-toastr';      // Alert message using NGX toastr

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  p: number = 1;                      // Settup up pagination variable
  perPage: number = 5;                // Settup up item per page variable
  Students: Student[];                 // Save students data in Student's array.
  hideWhenNoStudent: boolean = false; // Hide students data table when no student.
  noData: boolean = false;            // Showing No Student Message, when no student in database.
  preLoader: boolean = true;          // Showing Preloader to show user data is coming for you from thre server(A tiny UX Shit)
  
  constructor(
    public crudApi: CrudService, // Inject student CRUD services in constructor.
    public toastr: ToastrService // Toastr service for alert message
    ){ }

    ngOnInit() {
      this.dataState(); // Initialize student's list, when component is ready
      let s = this.crudApi.GetStudentsList(); 
      s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
        this.Students = [];
        data.forEach(item => {
          let a = item.payload.toJSON(); 
          a['$key'] = item.key;
          this.Students.push(a as Student);
        })
      })
    }
  
    // Using valueChanges() method to fetch simple list of students data. It updates the state of hideWhenNoStudent, noData & preLoader variables when any changes occurs in student data list in real-time.
    dataState() {  
      let s = this.crudApi.GetStudentsList();    
      s.valueChanges().subscribe(data => {
        this.preLoader = false;
        if(data.length <= 0){
          this.hideWhenNoStudent = false;
          this.noData = true;
        } else {
          this.hideWhenNoStudent = true;
          this.noData = false;
        }
      })
    }
  
    // Method to delete student object
    deleteStudent(student: any) {
      if (window.confirm('Are sure you want to delete this student ?')) { // Asking from user before Deleting student data.
        this.crudApi.DeleteStudent(student.$key) // Using Delete student API to delete student.
        this.toastr.success(student.firstName + ' successfully deleted!',"Deleted"); // Alert message will show up when student successfully deleted.
      }
    }

}
