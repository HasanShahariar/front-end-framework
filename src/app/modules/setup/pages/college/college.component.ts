import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollegeService } from '../../services/college.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { finalize, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-college',
  templateUrl: './college.component.html',
  styleUrls: ['./college.component.css']
})
export class CollegeComponent implements OnInit {


  @ViewChild('noticeSwal')
  
  noticeSwal!: SwalComponent;

  numberOfEntries: number;
  currentPage: number;
  pageSize: number;
  searchForm: FormGroup;
  searchKey: any;
  spin: boolean = false;
  hasData: boolean = false;
  colleges: any[] = [];
  isSubmit: boolean;
  isCancel: boolean;
  kloading: boolean;
  idToDelete: any;
  editId: any;
  swalOptions: SweetAlertOptions = {};
  entrieCountList:any[] = [5,10,15,25,50,100];
  isFilter = false
  isOpen: boolean;
  isOpenAction: number | null = null;
  shouldDropUp: boolean = false;
  collegeForm:FormGroup;


  constructor(
    private service: CollegeService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private router:Router,
    private alert: ToastrService
  ) {}


  ngOnInit() {

    this.pageSize = 10;
    this.currentPage = 1;
    this.numberOfEntries = 0; 
    this.getCollegeList();
    this.createFilterForm();
    this.createcollegeForm();
  }

  createcollegeForm() {
    this.collegeForm = this.fb.group({
      Id: 0,
      Name: ["", Validators.required]
    });
  }


  toggleDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent the click event from bubbling up
    this.isOpenAction = this.isOpenAction === index ? null : index;
  }

  closeDropdown(): void {
    this.isOpenAction = null;
  }
  createFilterForm() {
    this.searchForm = this.fb.group({
      pageSize: 10,
      searchKey:null
    });
  }

  setNumberOfTableEntries(event: any) {
    this.pageSize = +event.target.value;
    this.getCollegeList();
  }

  onCancelButtonClick(){
    document.getElementById("close-button").click()
  }

  getCollegeList() {
    // this.editId = null;
    this.spin = true;
    // this.service
    //   .getCollegePagination(this.currentPage, this.pageSize, this.searchKey)
    //   .pipe(
    //     tap((data: any) => {
    //       this.colleges = data.DataList;
    //       console.log(this.colleges);
    //       this.hasData = this.colleges.length > 0;
    //       this.numberOfEntries = data.DataCount;
    //       this.cdr.detectChanges();
    //     }),
    //     finalize(() => {
    //       this.spin = false;
    //     })
    //   )
    //   .subscribe();


      this.service
      .getCollegePagination(this.currentPage, this.pageSize, this.searchKey).subscribe(
        (data)=>{
          this.colleges = data.DataList;
          console.log(this.colleges);
          this.hasData = this.colleges.length > 0;
          this.numberOfEntries = data.DataCount;
          this.cdr.detectChanges();
          
        },
        (err)=>{
          this.spin = false;
        }
      )



  }
  

  updatePageWiseTableData(event) {
    this.currentPage = event;
    this.getCollegeList();
  }

  careateOrEditModalPopUp(createOrUpdateModal, data?) {
    
    if (data?.Id) {
      // this.editId = id;
      this.collegeForm.patchValue({
        Id : data.Id,
        Name : data.Name
      })
    } else {
      // this.editId = null;
      this.collegeForm.get("Id").patchValue(0);
    this.collegeForm.get("Name").patchValue(null);
    }
    this.modalService.open(createOrUpdateModal, { size: 'lg',centered:true });
  }


  reloadData() {
    this.currentPage = 1;
    this.getCollegeList();
  }

  getRegionListByCriteria(event) {
    this.pageSize = Number(event.pageSize);
    this.searchKey = event.searchKey;
    this.getCollegeList();
  }

  onCancelPopUp() {
    document.getElementById('close-button').click();
  }

  filterModalPopUp(advanceFilterModal) {
    this.modalService.open(advanceFilterModal, { size: 'lg' });
  }

  DeleteRegionPopUp(deleteConfirmation, id) {
    this.idToDelete = id;
    this.modalService.open(deleteConfirmation, { size: 'md' });
  }

  
  onSubmit() {

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.collegeForm.value.Id > 0 ? 'User updated successfully!' : 'User created successfully!',
    };
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: '',
    };

    if (!this.collegeForm.valid) {
      this.alert.error("Please provide valid information");
      return;
    }

    this.service.createCollege(this.collegeForm.value).subscribe(
      (data) => {
        console.log(data);
        if (data.HasError) {
          this.showAlert(errorAlert);
        } else {
          debugger
          this.showAlert(successAlert);
    
          // this.router.navigate(["setup/brand-list"]);
        }
      },
      (err) => {
        console.log(err);
        this.showAlert(errorAlert);
      }
    );
  }

  deleteButtonClick(id) {
    
    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      // text: this.userModel.id > 0 ? 'User updated successfully!' : 'User created successfully!',
      text: 'College deleted successfully!',
    };
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: '',
    };
    this.service.deleteCollege(id).subscribe(
      (data) => {
        this.showAlert(successAlert);
        this.getCollegeList();
      },
      (err) => {
        console.log(err);
        this.showAlert(errorAlert);
        
      }
    );
  }
  filterData(){
    this.searchKey = this.searchForm.value.searchKey;
    this.pageSize = this.searchForm.value.pageSize;
    this.getCollegeList()
    
  }
  handleBlur(forControl) {
    return forControl.valid || forControl.untouched;
  }

  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign({
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-" + style
      }
    }, swalOptions);
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }
  
}
