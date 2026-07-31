import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../services/contract.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
})
export class ContractsComponent implements OnInit {
  contracts: any[] = [];
  filteredContracts: any[] = [];
  selectedContract: any = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  statusFilter = 'All';
  companyId = '';
  actionLoading = false;

  statusOptions = ['All', 'Draft', 'Active', 'Approved', 'Rejected', 'Completed'];

  columns = [
    { field: 'contractCode', header: 'Contract ID' },
    { field: 'assetName', header: 'Asset' },
    { field: 'renterName', header: 'Renter' },
    { field: 'ownerName', header: 'Owner' },
    { field: 'totalPrice', header: 'Value' },
    { field: 'status', header: 'Status' },
  ];

  constructor(
    private contractService: ContractService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const company = this.authService.getCompany();
    this.companyId = company?._id || company?.id || '';
    this.loadContracts();
  }

  loadContracts() {
    this.isLoading = true;
    this.errorMessage = '';
    this.contractService.getContracts().subscribe({
      next: (res: any) => {
        const raw = Array.isArray(res) ? res : res.data || [];
        this.contracts = raw.map((c: any) => ({
          ...c,
          assetName: c.assetId?.assetName || '—',
          renterName: c.companyId?.companyName || '—',
          ownerName: c.ownerCompanyId?.companyName || '—',
          startDateFormatted: c.startDate ? new Date(c.startDate).toLocaleDateString() : '—',
          endDateFormatted: c.endDate ? new Date(c.endDate).toLocaleDateString() : '—',
        }));
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.error?.error || 'Failed to load contracts';
      },
    });
  }

  applyFilter() {
    let result = this.contracts;

    // Status filter
    if (this.statusFilter !== 'All') {
      result = result.filter((c) => c.status === this.statusFilter);
    }

    // Search filter
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter((c) =>
        [c.contractCode, c.assetName, c.renterName, c.ownerName]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(term))
      );
    }

    this.filteredContracts = result;
  }

  onContractAction(contract: any) {
    this.selectedContract = contract;
    this.successMessage = '';
    this.errorMessage = '';
  }

  closePanel() {
    this.selectedContract = null;
  }

  // Check if the logged-in user is the Owner of this contract
  isOwner(contract: any): boolean {
    if (!contract) return false;
    const ownerId = contract.ownerCompanyId?._id || contract.ownerCompanyId;
    return this.companyId === ownerId;
  }

  approveContract() {
    if (!this.selectedContract) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.contractService.approveContract(this.selectedContract._id).subscribe({
      next: (res: any) => {
        this.actionLoading = false;
        this.successMessage = 'Contract approved successfully!';
        this.selectedContract.status = 'Active';
        this.loadContracts();
      },
      error: (err) => {
        this.actionLoading = false;
        this.errorMessage = err.error?.error || err.error?.message || 'Failed to approve contract';
      },
    });
  }

  rejectContract() {
    if (!this.selectedContract) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.contractService.rejectContract(this.selectedContract._id).subscribe({
      next: (res: any) => {
        this.actionLoading = false;
        this.successMessage = 'Contract rejected.';
        this.selectedContract.status = 'Rejected';
        this.loadContracts();
      },
      error: (err) => {
        this.actionLoading = false;
        this.errorMessage = err.error?.error || err.error?.message || 'Failed to reject contract';
      },
    });
  }

  generatePdf() {
    if (!this.selectedContract) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.contractService.generatePdf(this.selectedContract._id).subscribe({
      next: (res: any) => {
        this.actionLoading = false;
        this.successMessage = 'PDF generated successfully!';
      },
      error: (err) => {
        this.actionLoading = false;
        this.errorMessage = err.error?.message || 'Failed to generate PDF';
      },
    });
  }

  downloadPdf(contractId: string) {
    window.open(this.contractService.getDownloadUrl(contractId), '_blank');
  }

  viewPdf(contractId: string) {
    window.open(this.contractService.getViewUrl(contractId), '_blank');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Draft': return 'status-draft';
      case 'Active': return 'status-active';
      case 'Approved': return 'status-approved';
      case 'Rejected': return 'status-rejected';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  }
}