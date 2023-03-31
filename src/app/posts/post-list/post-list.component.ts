import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post-models/post.model';
import { PostsService } from '../post-services/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  isLoadingOnScroll = false;
  isFinished: boolean;
  private postsSub!: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.isFinished.subscribe((isFinished) => {
      this.isFinished = isFinished;
      console.log('Showing all posts:', isFinished);
    });
    this.isLoading = true;
    this.postsService.getNextBatch();

    // this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.isLoadingOnScroll = false;
        this.posts = posts;
      });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onDelete(id: string) {
    this.postsService.deletePost(id);
  }
  onClear() {
    if (confirm('Are you sure?')) {
      this.postsService.clearPosts();
    }
  }
  onScroll() {
    // this.isLoadingOnScroll = true;
    // this.postsService.getPosts();
  }
}
