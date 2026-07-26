import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
})
export class ContractsComponent implements OnInit {
  contracts: any[] = [];
  filteredContracts: any[] = [];
  selectedContract: any = null;
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  columns = [
    { field: 'contractCode', header: 'Contract ID' },
    { field: 'renterName', header: 'Renter' },
    { field: 'ownerName', header: 'Owner' },
    { field: 'totalPrice', header: 'Value' },
    { field: 'status', header: 'Status' },
  ];

  constructor(private contractService: ContractService) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts() {
    this.isLoading = true;
    this.contractService.getContracts().subscribe({
      next: (res: any) => {
        this.contracts = res.map((c: any) => ({
          ...c,
          renterName: c.companyId?.companyName,
          ownerName: c.ownerCompanyId?.companyName,
        }));
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to load contracts';
      },
    });
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredContracts = this.contracts;
      return;
    }
    this.filteredContracts = this.contracts.filter((c) =>
      [c.contractCode, c.renterName, c.ownerName]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }

  toggleFilterPanel() {
    console.log('Filter panel toggled');
  }

  onContractAction(contract: any) {
    this.selectedContract = contract;
  }

  downloadPdf(contractId: string) {
    window.open(this.contractService.getDownloadUrl(contractId), '_blank');
  }
}