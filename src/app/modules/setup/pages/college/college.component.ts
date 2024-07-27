import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CollegeService } from '../../services/college.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';

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
  hasData: boolean;
  bank: any[] = [];
  isSubmit: boolean;
  isCancel: boolean;
  kloading: boolean;
  idToDelete: any;
  editId: any;
  swalOptions: SweetAlertOptions = {};

  constructor(
    private service: CollegeService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.pageSize = 10;
    this.currentPage = 1;
    this.getUnitList();
    this.createFilterForm();
  }

  setNumberOfTableEntries(event: any) {
    this.pageSize = +event.target.value;
    this.getUnitList();
  }

  onCancelButtonClick(){
    document.getElementById("close-button").click()
  }

  getUnitList() {
    this.editId = null;
    this.spin = true;
    this.service
      .getCollegePagination(this.currentPage, this.pageSize, this.searchKey)
      .subscribe({
        next: (data: PaginatedResult<any[]>) => {
          this.bank = data.result;
          this.spin = false;
          console.log(this.bank);
          if (data.result.length >
            0) {
            this.hasData = true;
          } else {
            this.hasData = false;
          }
          this.numberOfEntries = data.pagination.totalItems;
        },

        error: (err) => {
          this.spin = false;
          this.hasData = false;
          console.log(err);
        },
      });
  }

  updatePageWiseTableData(event) {
    this.currentPage = event;
    this.getUnitList();
  }

  careateOrEditModalPopUp(createOrUpdateModal, id?) {
    if (id) {
      this.editId = id;
    } else {
      this.editId = null;
    }
    this.modalService.open(createOrUpdateModal, { size: 'lg' });
  }

  createFilterForm() {
    this.searchForm = this.fb.group({
      region: null,
    });
  }

  reloadData() {
    this.currentPage = 1;
    this.getUnitList();
  }

  getRegionListByCriteria(event) {
    this.pageSize = Number(event.pageSize);
    this.searchKey = event.searchKey;
    this.getUnitList();
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

  deleteButtonClick() {
    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      // text: this.userModel.id > 0 ? 'User updated successfully!' : 'User created successfully!',
      text: 'User deleted successfully!',
    };
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: '',
    };
    this.service.deleteCollege(this.idToDelete).subscribe(
      (data) => {
        this.showAlert(successAlert);
        this.getUnitList();
      },
      (err) => {
        console.log(err);
        
      }
    );
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
