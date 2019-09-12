import { Artist } from "./../../../models/member.model";
import { Component, OnInit, Inject } from "@angular/core";
import { MemberService } from "./../../../services/member.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-artist-dialog",
  templateUrl: "./artist-dialog.component.html",
  styleUrls: ["./artist-dialog.component.css"]
})
export class ArtistDialogComponent implements OnInit {
  artistGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ArtistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Artist,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.artistGroup = this.fb.group({
      name: [this.data ? this.data.name : "", Validators.required],
      origin: [this.data ? this.data.origin : "", Validators.required],
      facebookUrl: [this.data ? this.data.facebookUrl : "", Validators.required]
    });
  }

  saveArtist() {
    const artist: Artist = {
      name: this.artistGroup.get("name").value,
      origin: this.artistGroup.get("origin").value,
      facebookUrl: this.artistGroup.get("facebookUrl").value,
      createdBy: this.memberService.getUser()
    };
    this.dialogRef.close(artist);
    console.log("artist", artist);
  }

  cancel() {
    this.dialogRef.close();
  }
}
