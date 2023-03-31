import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PostsService } from '../post-services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post-models/post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode: string | any;
  private postId: string | any;
  public post: Post | any;
  isLoading = false;
  isFinished: boolean;
  form: FormGroup | any;
  imagePreview: string | any;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  // tslint:disable-next-line:typedef
  onSavePost() {
    if (this.form!.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form!.value.title,
        this.form!.value.content,
        this.form!.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId!,
        this.form!.value.title,
        this.form!.value.content,
        this.form!.value.image
      );
    }

    this.form!.reset();
  }

  onImagePicked(event: Event) {
    const imageTarget = event.target as HTMLInputElement;
    const file = imageTarget.files![0];
    this.form!.patchValue({ image: file });
    this.form!.get('image')!.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      // console.log(this.form!.get('image')!.valid);
    };
    reader.readAsDataURL(file);
  }

  ngOnInit(): void {
    // for (let i = 0; i < 100; i++) {
    //   this.postsService.addPost('title ' + i, 'content ' + i, null);
    //   setTimeout(function () {
    //     //your code to be executed after 1 second
    //   }, 1000);
    // }

    this.postsService.isFinished.subscribe((isFinished) => {
      this.isFinished = isFinished;
      console.log(isFinished);
    });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        // validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        // this.mode = 'edit';
        this.postId = paramMap.get('postId')!;
        // console.log(this.postId);
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          };
          // console.log(postData);
          this.form!.setValue({
            title: this.post.title,
            content: this.post.content,
            image: null,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
}
