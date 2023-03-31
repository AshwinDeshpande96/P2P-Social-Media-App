import { Post } from "../post-models/post.model";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import * as uuid from "uuid";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private batch_size = 10;
  private lastKey = 0;
  private postsUpdated = new Subject<Post[]>();
  private postFinishedSource = new BehaviorSubject<boolean>(false);
  isFinished = this.postFinishedSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(
        "http://35.222.28.34:80/api/posts/batch"
      )
      .pipe(
        map((postData) => {
          return postData.posts.map(
            (post: { title: any; content: any; _id: any }) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
              };
            }
          );
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  setPostsFinished(isFinished: boolean) {
    this.postFinishedSource.next(isFinished);
  }

  getNextBatch() {
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append("batch_size", this.batch_size);
    params = params.append("start_index", this.lastKey);

    this.http
      .get<{ message: string; posts: any }>(
        "http://35.222.28.34:80/api/posts/batch",
        {
          params: params,
        }
      )
      .pipe(
        map((postData) => {
          return postData.posts.map(
            (post: { title: any; content: any; _id: any }) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
              };
            }
          );
        })
      )
      .subscribe((posts) => {
        if (posts.length > 0) {
          this.posts = [...this.posts, ...posts];
          this.postsUpdated.next([...this.posts]);
        } else {
          console.log("Posts Finished!");
          this.setPostsFinished(true);
        }
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    const _id = uuid.v4();
    postData.append("id", _id);
    postData.append("title", title);
    postData.append("content", content);
    if (image != null) {
      postData.append("image", image, title);
    }

    this.http
      .post<{ message: string; postId: string }>(
        "http://35.222.28.34:80/api/posts",
        postData
      )
      .subscribe((responseData) => {
        const post: Post = {
          id: _id,
          title: title,
          content: content,
        };
        this.posts = [post, ...this.posts];
        this.postsUpdated.next([...this.posts]);
        this.setPostsFinished(false);
        this.router.navigate(["/"]);
      });
  }

  getPost(postId: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      "http://35.222.28.34:80/api/posts/" + postId
    );
  }

  updatePost(postId: string, title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("id", postId);
    postData.append("title", title);
    postData.append("content", content);
    if (image != null) {
      postData.append("image", image, title);
    }

    // const post: Post = { id: postId, title: title, content: content };
    this.http
      .put("http://35.222.28.34:80/api/posts/" + postId, postData)
      .subscribe((responseData) => {
        const post: Post = {
          id: postId,
          title: title,
          content: content,
        };
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === postId);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete("http://35.222.28.34:80/api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  clearPosts() {
    this.http.delete("http://35.222.28.34:80/api/posts/").subscribe(() => {
      this.setPostsFinished(false);
      this.posts = [];
      this.postsUpdated.next([...this.posts]);
    });
  }
}
