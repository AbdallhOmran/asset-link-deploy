import { Component } from '@angular/core';
@Component({
  selector: 'app-team-members',
  templateUrl:'./team-members.component.html',
  styleUrls: ['./team-members.component.css']
})
export class TeamMembersComponent {

  columns = [
    'Member',
    'Title',
    'Email',
    'Role',
    'Joined'
  ];

  members = [
    {
      initials: 'MC',
      color: 'bg-sky-500',
      name: 'Marcus Chen',
      title: 'Fleet Manager',
      email: 'marcus.chen@terraequip.com',
      role: 'Admin',
      joined: 'Jan 2023'
    },
    {
      initials: 'SV',
      color: 'bg-pink-500',
      name: 'Sarah Voss',
      title: 'Operations Director',
      email: 's.voss@terraequip.com',
      role: 'Admin',
      joined: 'Mar 2023'
    },
    {
      initials: 'DO',
      color: 'bg-orange-500',
      name: 'Daniel Okafor',
      title: 'Logistics Lead',
      email: 'd.okafor@terraequip.com',
      role: 'Member',
      joined: 'Jun 2023'
    },
    {
      initials: 'PN',
      color: 'bg-emerald-500',
      name: 'Priya Nair',
      title: 'Finance Manager',
      email: 'p.nair@terraequip.com',
      role: 'Member',
      joined: 'Sep 2023'
    },
    {
      initials: 'TB',
      color: 'bg-slate-500',
      name: 'Tom Becker',
      title: 'Field Inspector',
      email: 't.becker@terraequip.com',
      role: 'Viewer',
      joined: 'Feb 2024'
    }
  ];
}
