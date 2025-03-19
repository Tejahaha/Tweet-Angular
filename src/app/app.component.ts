import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Tweet {
  id: number;
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit {
  title = 'Tweet Application';
  tweets: Tweet[] = [];
  tweetMessage: string = '';
  editMode: boolean = false;
  editIndex: number = -1;
  deleteIndex: number = -1;
  
  ngOnInit(): void {
    this.loadTweets();
  }
  
  // Load tweets from session storage
  loadTweets(): void {
    // Check if window is defined (client-side) before accessing sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storedTweets = sessionStorage.getItem('tweets');
      if (storedTweets) {
        // Parse the stored tweets and convert timestamp strings back to Date objects
        this.tweets = JSON.parse(storedTweets).map((tweet: any) => ({
          ...tweet,
          timestamp: new Date(tweet.timestamp)
        }));
      }
    }
  }
  
  // Save tweets to session storage
  saveTweets(): void {
    // Check if window is defined (client-side) before accessing sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('tweets', JSON.stringify(this.tweets));
    }
  }
  
  // Add a new tweet
  addTweet(): void {
    if (this.tweetMessage.trim() === '') return;
    
    const newTweet: Tweet = {
      id: Date.now(),
      message: this.tweetMessage,
      timestamp: new Date()
    };
    
    this.tweets.unshift(newTweet); // Add to beginning of array
    this.saveTweets();
    this.tweetMessage = ''; // Clear the input field
  }
  
  // Confirm delete tweet
  confirmDelete(index: number): void {
    this.deleteIndex = index;
  }

  // Cancel delete
  cancelDelete(): void {
    this.deleteIndex = -1;
  }

  // Delete a tweet
  deleteTweet(index: number): void {
    this.tweets.splice(index, 1);
    this.saveTweets();
    this.deleteIndex = -1; // Reset delete confirmation state
    
    // If we're currently editing this tweet, cancel the edit
    if (this.editMode && this.editIndex === index) {
      this.cancelEdit();
    } else if (this.editIndex > index) {
      // Adjust editIndex if we deleted a tweet before the one being edited
      this.editIndex--;
    }
  }
  
  // Enter edit mode for a tweet
  editTweet(index: number): void {
    this.editMode = true;
    this.editIndex = index;
    this.tweetMessage = this.tweets[index].message;
  }
  
  // Update an existing tweet
  updateTweet(): void {
    if (this.tweetMessage.trim() === '') return;
    
    this.tweets[this.editIndex].message = this.tweetMessage;
    this.tweets[this.editIndex].timestamp = new Date(); // Update timestamp
    this.saveTweets();
    this.cancelEdit();
  }
  
  // Cancel edit mode
  cancelEdit(): void {
    this.editMode = false;
    this.editIndex = -1;
    this.tweetMessage = '';
  }
}
