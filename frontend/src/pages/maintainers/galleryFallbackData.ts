export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
  uploadedAt: string;
  status: 'approved' | 'pending' | 'rejected';
  uploaderName: string;
}

export const fallbackGalleryData: GalleryItem[] = [
  {
    "id": 1,
    "title": "Tamashbin Kathputliya - Open Air Cast Assembly",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_1.jpg",
    "caption": "Authentic photo capture of open air cast assembly during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 19, 2026",
    "status": "approved",
    "uploaderName": "Utkarsh (Yuuhi)"
  },
  {
    "id": 2,
    "title": "Tamashbin Kathputliya - Satirical Street Play Scene",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_2.jpg",
    "caption": "Authentic photo capture of satirical street play scene during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 18, 2026",
    "status": "approved",
    "uploaderName": "S. Sri Vaishnavi"
  },
  {
    "id": 3,
    "title": "Tamashbin Kathputliya - Dholak & Percussion Monologue",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_3.jpg",
    "caption": "Authentic photo capture of dholak & percussion monologue during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 17, 2026",
    "status": "approved",
    "uploaderName": "Samarth Shrivastava"
  },
  {
    "id": 4,
    "title": "Tamashbin Kathputliya - Courtyard Audience Engagement",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_4.jpg",
    "caption": "Authentic photo capture of courtyard audience engagement during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 16, 2026",
    "status": "approved",
    "uploaderName": "Krishna Subramanian"
  },
  {
    "id": 5,
    "title": "Tamashbin Kathputliya - Improv Puppet Dialogue",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_5.jpg",
    "caption": "Authentic photo capture of improv puppet dialogue during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 15, 2026",
    "status": "approved",
    "uploaderName": "Sneha Das"
  },
  {
    "id": 6,
    "title": "Tamashbin Kathputliya - Nukkad Natak Chorus Chant",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_6.jpg",
    "caption": "Authentic photo capture of nukkad natak chorus chant during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 14, 2026",
    "status": "approved",
    "uploaderName": "Abay Nandhiga"
  },
  {
    "id": 7,
    "title": "Tamashbin Kathputliya - Courtyard Drama Sequence",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_7.jpg",
    "caption": "Authentic photo capture of courtyard drama sequence during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 13, 2026",
    "status": "approved",
    "uploaderName": "Utkarsh (Yuuhi)"
  },
  {
    "id": 8,
    "title": "Tamashbin Kathputliya - Kashiyatra Street Showcase",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_8.jpg",
    "caption": "Authentic photo capture of kashiyatra street showcase during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 12, 2026",
    "status": "approved",
    "uploaderName": "S. Sri Vaishnavi"
  },
  {
    "id": 9,
    "title": "Tamashbin Kathputliya - Festival Crowd Gathering",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_9.jpg",
    "caption": "Authentic photo capture of festival crowd gathering during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 11, 2026",
    "status": "approved",
    "uploaderName": "Samarth Shrivastava"
  },
  {
    "id": 10,
    "title": "Tamashbin Kathputliya - Dramatic Climax Pose",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_10.jpg",
    "caption": "Authentic photo capture of dramatic climax pose during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 10, 2026",
    "status": "approved",
    "uploaderName": "Krishna Subramanian"
  },
  {
    "id": 11,
    "title": "Tamashbin Kathputliya - Street Theatre Finale",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_11.jpg",
    "caption": "Authentic photo capture of street theatre finale during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 09, 2026",
    "status": "approved",
    "uploaderName": "Sneha Das"
  },
  {
    "id": 12,
    "title": "Tamashbin Kathputliya - Cast Curtain Bow",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_12.jpg",
    "caption": "Authentic photo capture of cast curtain bow during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 08, 2026",
    "status": "approved",
    "uploaderName": "Abay Nandhiga"
  },
  {
    "id": 13,
    "title": "Tamashbin Kathputliya - Rehearsal Vocal Projection",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_13.jpg",
    "caption": "Authentic photo capture of rehearsal vocal projection during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 07, 2026",
    "status": "approved",
    "uploaderName": "Utkarsh (Yuuhi)"
  },
  {
    "id": 14,
    "title": "Tamashbin Kathputliya - Campus Open-Air Tableau",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_14.jpg",
    "caption": "Authentic photo capture of campus open-air tableau during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 06, 2026",
    "status": "approved",
    "uploaderName": "S. Sri Vaishnavi"
  },
  {
    "id": 15,
    "title": "Tamashbin Kathputliya - Final Chorus Ovation",
    "category": "Tamashbin Kathputliya",
    "imageUrl": "/aayam_assets/tamashbin_user_15.jpg",
    "caption": "Authentic photo capture of final chorus ovation during Aayam Tamashbin Kathputliya drama production.",
    "uploadedAt": "Jul 05, 2026",
    "status": "approved",
    "uploaderName": "Samarth Shrivastava"
  },
  {
    "id": 16,
    "title": "DDDJ - Auditorium Stage Scene",
    "category": "DDDJ",
    "imageUrl": "/aayam_assets/dddj_user_1.jpg",
    "caption": "Authentic photo capture of auditorium stage scene during Aayam DDDJ drama production.",
    "uploadedAt": "Jul 19, 2026",
    "status": "approved",
    "uploaderName": "Utkarsh (Yuuhi)"
  },
  {
    "id": 17,
    "title": "DDDJ - Dramatic Spotlight Monologue",
    "category": "DDDJ",
    "imageUrl": "/aayam_assets/dddj_user_2.jpg",
    "caption": "Authentic photo capture of dramatic spotlight monologue during Aayam DDDJ drama production.",
    "uploadedAt": "Jul 18, 2026",
    "status": "approved",
    "uploaderName": "S. Sri Vaishnavi"
  },
  {
    "id": 18,
    "title": "DDDJ - Full Ensemble Bow",
    "category": "DDDJ",
    "imageUrl": "/aayam_assets/dddj_user_3.jpg",
    "caption": "Authentic photo capture of full ensemble bow during Aayam DDDJ drama production.",
    "uploadedAt": "Jul 17, 2026",
    "status": "approved",
    "uploaderName": "Samarth Shrivastava"
  },
  {
    "id": 19,
    "title": "DDDJ - Intense Scene Confrontation",
    "category": "DDDJ",
    "imageUrl": "/aayam_assets/dddj_user_4.jpg",
    "caption": "Authentic photo capture of intense scene confrontation during Aayam DDDJ drama production.",
    "uploadedAt": "Jul 16, 2026",
    "status": "approved",
    "uploaderName": "Krishna Subramanian"
  },
  {
    "id": 20,
    "title": "DDDJ - Backstage Final Prep",
    "category": "DDDJ",
    "imageUrl": "/aayam_assets/dddj_user_5.jpg",
    "caption": "Authentic photo capture of backstage final prep during Aayam DDDJ drama production.",
    "uploadedAt": "Jul 15, 2026",
    "status": "approved",
    "uploaderName": "Sneha Das"
  },
  {
    "id": 21,
    "title": "DDDJ - Proscenium Lighting Setup",
    "category": "DDDJ",
    "imageUrl": "/aayam_assets/dddj_user_6.jpg",
    "caption": "Authentic photo capture of proscenium lighting setup during Aayam DDDJ drama production.",
    "uploadedAt": "Jul 14, 2026",
    "status": "approved",
    "uploaderName": "Abay Nandhiga"
  },
  {
    "id": 22,
    "title": "DDDJ - Stage Climax Dramatic Sequence",
    "category": "DDDJ",
    "imageUrl": "/aayam_assets/dddj_user_7.jpg",
    "caption": "Authentic photo capture of stage climax dramatic sequence during Aayam DDDJ drama production.",
    "uploadedAt": "Jul 13, 2026",
    "status": "approved",
    "uploaderName": "Utkarsh (Yuuhi)"
  },
  {
    "id": 23,
    "title": "DDDJ - Lead Actor Soliloquy",
    "category": "DDDJ",
    "imageUrl": "/aayam_assets/dddj_user_8.jpg",
    "caption": "Authentic photo capture of lead actor soliloquy during Aayam DDDJ drama production.",
    "uploadedAt": "Jul 12, 2026",
    "status": "approved",
    "uploaderName": "S. Sri Vaishnavi"
  },
  {
    "id": 24,
    "title": "DDDJ - Chorus Alignment on Stage",
    "category": "DDDJ",
    "imageUrl": "/aayam_assets/dddj_user_9.jpg",
    "caption": "Authentic photo capture of chorus alignment on stage during Aayam DDDJ drama production.",
    "uploadedAt": "Jul 11, 2026",
    "status": "approved",
    "uploaderName": "Samarth Shrivastava"
  },
  {
    "id": 25,
    "title": "KKY - Karn Tragic Climax Scene",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_1.jpg",
    "caption": "Authentic photo capture of karn tragic climax scene during Aayam KKY drama production.",
    "uploadedAt": "Jul 19, 2026",
    "status": "approved",
    "uploaderName": "Utkarsh (Yuuhi)"
  },
  {
    "id": 26,
    "title": "KKY - Armor & Dialogue Rehearsal",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_2.jpg",
    "caption": "Authentic photo capture of armor & dialogue rehearsal during Aayam KKY drama production.",
    "uploadedAt": "Jul 18, 2026",
    "status": "approved",
    "uploaderName": "S. Sri Vaishnavi"
  },
  {
    "id": 27,
    "title": "KKY - Stage Finale Spotlight",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_3.jpg",
    "caption": "Authentic photo capture of stage finale spotlight during Aayam KKY drama production.",
    "uploadedAt": "Jul 17, 2026",
    "status": "approved",
    "uploaderName": "Samarth Shrivastava"
  },
  {
    "id": 28,
    "title": "KKY - Chariot Wheel Soliloquy",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_4.jpg",
    "caption": "Authentic photo capture of chariot wheel soliloquy during Aayam KKY drama production.",
    "uploadedAt": "Jul 16, 2026",
    "status": "approved",
    "uploaderName": "Krishna Subramanian"
  },
  {
    "id": 29,
    "title": "KKY - Kaurava Court Monologue",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_5.jpg",
    "caption": "Authentic photo capture of kaurava court monologue during Aayam KKY drama production.",
    "uploadedAt": "Jul 15, 2026",
    "status": "approved",
    "uploaderName": "Sneha Das"
  },
  {
    "id": 30,
    "title": "KKY - Kashiyatra Award Performance",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_6.jpg",
    "caption": "Authentic photo capture of kashiyatra award performance during Aayam KKY drama production.",
    "uploadedAt": "Jul 14, 2026",
    "status": "approved",
    "uploaderName": "Abay Nandhiga"
  },
  {
    "id": 31,
    "title": "KKY - Backstage Armor Prep",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_7.jpg",
    "caption": "Authentic photo capture of backstage armor prep during Aayam KKY drama production.",
    "uploadedAt": "Jul 13, 2026",
    "status": "approved",
    "uploaderName": "Utkarsh (Yuuhi)"
  },
  {
    "id": 32,
    "title": "KKY - Dharma Speech Sequence",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_8.jpg",
    "caption": "Authentic photo capture of dharma speech sequence during Aayam KKY drama production.",
    "uploadedAt": "Jul 12, 2026",
    "status": "approved",
    "uploaderName": "S. Sri Vaishnavi"
  },
  {
    "id": 33,
    "title": "KKY - Ensemble Chorus Recitation",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_9.jpg",
    "caption": "Authentic photo capture of ensemble chorus recitation during Aayam KKY drama production.",
    "uploadedAt": "Jul 11, 2026",
    "status": "approved",
    "uploaderName": "Samarth Shrivastava"
  },
  {
    "id": 34,
    "title": "KKY - Curtain Call Bow",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_10.jpg",
    "caption": "Authentic photo capture of curtain call bow during Aayam KKY drama production.",
    "uploadedAt": "Jul 10, 2026",
    "status": "approved",
    "uploaderName": "Krishna Subramanian"
  },
  {
    "id": 35,
    "title": "KKY - Vocal Projection Practice",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_11.jpg",
    "caption": "Authentic photo capture of vocal projection practice during Aayam KKY drama production.",
    "uploadedAt": "Jul 09, 2026",
    "status": "approved",
    "uploaderName": "Sneha Das"
  },
  {
    "id": 36,
    "title": "KKY - Sopanam Dramatic Tableau",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_12.jpg",
    "caption": "Authentic photo capture of sopanam dramatic tableau during Aayam KKY drama production.",
    "uploadedAt": "Jul 08, 2026",
    "status": "approved",
    "uploaderName": "Abay Nandhiga"
  },
  {
    "id": 37,
    "title": "KKY - Royal Court Confrontation",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_13.jpg",
    "caption": "Authentic photo capture of royal court confrontation during Aayam KKY drama production.",
    "uploadedAt": "Jul 07, 2026",
    "status": "approved",
    "uploaderName": "Utkarsh (Yuuhi)"
  },
  {
    "id": 38,
    "title": "KKY - Epic Hero Monologue",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_14.jpg",
    "caption": "Authentic photo capture of epic hero monologue during Aayam KKY drama production.",
    "uploadedAt": "Jul 06, 2026",
    "status": "approved",
    "uploaderName": "S. Sri Vaishnavi"
  },
  {
    "id": 39,
    "title": "KKY - Sunset Rehearsal Circle",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_15.jpg",
    "caption": "Authentic photo capture of sunset rehearsal circle during Aayam KKY drama production.",
    "uploadedAt": "Jul 05, 2026",
    "status": "approved",
    "uploaderName": "Samarth Shrivastava"
  },
  {
    "id": 40,
    "title": "KKY - Chorus Rhythm Alignment",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_16.jpg",
    "caption": "Authentic photo capture of chorus rhythm alignment during Aayam KKY drama production.",
    "uploadedAt": "Jul 04, 2026",
    "status": "approved",
    "uploaderName": "Krishna Subramanian"
  },
  {
    "id": 41,
    "title": "KKY - Backstage Costume Check",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_17.jpg",
    "caption": "Authentic photo capture of backstage costume check during Aayam KKY drama production.",
    "uploadedAt": "Jul 03, 2026",
    "status": "approved",
    "uploaderName": "Sneha Das"
  },
  {
    "id": 42,
    "title": "KKY - Stage Spotlight Entrance",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_18.jpg",
    "caption": "Authentic photo capture of stage spotlight entrance during Aayam KKY drama production.",
    "uploadedAt": "Jul 20, 2026",
    "status": "approved",
    "uploaderName": "Abay Nandhiga"
  },
  {
    "id": 43,
    "title": "KKY - Dramatic Dialogue Delivery",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_19.jpg",
    "caption": "Authentic photo capture of dramatic dialogue delivery during Aayam KKY drama production.",
    "uploadedAt": "Jul 19, 2026",
    "status": "approved",
    "uploaderName": "Utkarsh (Yuuhi)"
  },
  {
    "id": 44,
    "title": "KKY - Cast Bowing Sequence",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_20.jpg",
    "caption": "Authentic photo capture of cast bowing sequence during Aayam KKY drama production.",
    "uploadedAt": "Jul 18, 2026",
    "status": "approved",
    "uploaderName": "S. Sri Vaishnavi"
  },
  {
    "id": 45,
    "title": "KKY - Festival Drama Showcase",
    "category": "KKY",
    "imageUrl": "/aayam_assets/kky_user_21.jpg",
    "caption": "Authentic photo capture of festival drama showcase during Aayam KKY drama production.",
    "uploadedAt": "Jul 17, 2026",
    "status": "approved",
    "uploaderName": "Samarth Shrivastava"
  },
  {
    "id": 46,
    "title": "Samatvam - Synchronized Chorus Movement",
    "category": "Samatvam",
    "imageUrl": "/aayam_assets/samatvam_user_1.jpg",
    "caption": "Authentic photo capture of synchronized chorus movement during Aayam Samatvam drama production.",
    "uploadedAt": "Jul 19, 2026",
    "status": "approved",
    "uploaderName": "Utkarsh (Yuuhi)"
  },
  {
    "id": 47,
    "title": "Samatvam - Center Stage Monologue",
    "category": "Samatvam",
    "imageUrl": "/aayam_assets/samatvam_user_2.jpg",
    "caption": "Authentic photo capture of center stage monologue during Aayam Samatvam drama production.",
    "uploadedAt": "Jul 18, 2026",
    "status": "approved",
    "uploaderName": "S. Sri Vaishnavi"
  },
  {
    "id": 48,
    "title": "Samatvam - Intermission Standing Line-up",
    "category": "Samatvam",
    "imageUrl": "/aayam_assets/samatvam_user_3.jpg",
    "caption": "Authentic photo capture of intermission standing line-up during Aayam Samatvam drama production.",
    "uploadedAt": "Jul 17, 2026",
    "status": "approved",
    "uploaderName": "Samarth Shrivastava"
  },
  {
    "id": 49,
    "title": "Samatvam - Empathy Drama Scene",
    "category": "Samatvam",
    "imageUrl": "/aayam_assets/samatvam_user_4.jpg",
    "caption": "Authentic photo capture of empathy drama scene during Aayam Samatvam drama production.",
    "uploadedAt": "Jul 16, 2026",
    "status": "approved",
    "uploaderName": "Krishna Subramanian"
  },
  {
    "id": 50,
    "title": "Samatvam - Modern Physical Theatre",
    "category": "Samatvam",
    "imageUrl": "/aayam_assets/samatvam_user_5.jpg",
    "caption": "Authentic photo capture of modern physical theatre during Aayam Samatvam drama production.",
    "uploadedAt": "Jul 15, 2026",
    "status": "approved",
    "uploaderName": "Sneha Das"
  },
  {
    "id": 51,
    "title": "Samatvam - Stage Lighting & Shadow",
    "category": "Samatvam",
    "imageUrl": "/aayam_assets/samatvam_user_6.jpg",
    "caption": "Authentic photo capture of stage lighting & shadow during Aayam Samatvam drama production.",
    "uploadedAt": "Jul 14, 2026",
    "status": "approved",
    "uploaderName": "Abay Nandhiga"
  },
  {
    "id": 52,
    "title": "Samatvam - Chorus Echo Recitation",
    "category": "Samatvam",
    "imageUrl": "/aayam_assets/samatvam_user_7.jpg",
    "caption": "Authentic photo capture of chorus echo recitation during Aayam Samatvam drama production.",
    "uploadedAt": "Jul 13, 2026",
    "status": "approved",
    "uploaderName": "Utkarsh (Yuuhi)"
  },
  {
    "id": 53,
    "title": "Samatvam - Backstage Ensemble Prep",
    "category": "Samatvam",
    "imageUrl": "/aayam_assets/samatvam_user_8.jpg",
    "caption": "Authentic photo capture of backstage ensemble prep during Aayam Samatvam drama production.",
    "uploadedAt": "Jul 12, 2026",
    "status": "approved",
    "uploaderName": "S. Sri Vaishnavi"
  },
  {
    "id": 54,
    "title": "Samatvam - Emotional Climax Monologue",
    "category": "Samatvam",
    "imageUrl": "/aayam_assets/samatvam_user_9.jpg",
    "caption": "Authentic photo capture of emotional climax monologue during Aayam Samatvam drama production.",
    "uploadedAt": "Jul 11, 2026",
    "status": "approved",
    "uploaderName": "Samarth Shrivastava"
  },
  {
    "id": 55,
    "title": "Samatvam - Audience Dialogue Engagement",
    "category": "Samatvam",
    "imageUrl": "/aayam_assets/samatvam_user_10.jpg",
    "caption": "Authentic photo capture of audience dialogue engagement during Aayam Samatvam drama production.",
    "uploadedAt": "Jul 10, 2026",
    "status": "approved",
    "uploaderName": "Krishna Subramanian"
  },
  {
    "id": 56,
    "title": "Samatvam - Movement Rehearsal Circle",
    "category": "Samatvam",
    "imageUrl": "/aayam_assets/samatvam_user_11.jpg",
    "caption": "Authentic photo capture of movement rehearsal circle during Aayam Samatvam drama production.",
    "uploadedAt": "Jul 09, 2026",
    "status": "approved",
    "uploaderName": "Sneha Das"
  },
  {
    "id": 57,
    "title": "Samatvam - Production Bow",
    "category": "Samatvam",
    "imageUrl": "/aayam_assets/samatvam_user_12.jpg",
    "caption": "Authentic photo capture of production bow during Aayam Samatvam drama production.",
    "uploadedAt": "Jul 08, 2026",
    "status": "approved",
    "uploaderName": "Abay Nandhiga"
  },
  {
    "id": 58,
    "title": "Speak Up Tara - Social Natak Opening",
    "category": "Speak Up Tara",
    "imageUrl": "/aayam_assets/speak_up_tara_user_1.webp",
    "caption": "Authentic photo capture of social natak opening during Speak Up Tara production.",
    "uploadedAt": "Jul 19, 2026",
    "status": "approved",
    "uploaderName": "Utkarsh (Yuuhi)"
  },
  {
    "id": 59,
    "title": "Speak Up Tara - Vocal Projection Address",
    "category": "Speak Up Tara",
    "imageUrl": "/aayam_assets/speak_up_tara_user_2.jpg",
    "caption": "Authentic photo capture of vocal projection address during Speak Up Tara production.",
    "uploadedAt": "Jul 18, 2026",
    "status": "approved",
    "uploaderName": "S. Sri Vaishnavi"
  },
  {
    "id": 60,
    "title": "Speak Up Tara - Climax Pose Formation",
    "category": "Speak Up Tara",
    "imageUrl": "/aayam_assets/speak_up_tara_user_3.webp",
    "caption": "Authentic photo capture of climax pose formation during Speak Up Tara production.",
    "uploadedAt": "Jul 17, 2026",
    "status": "approved",
    "uploaderName": "Samarth Shrivastava"
  },
  {
    "id": 61,
    "title": "Speak Up Tara - Women Empowerment Monologue",
    "category": "Speak Up Tara",
    "imageUrl": "/aayam_assets/speak_up_tara_user_4.jpg",
    "caption": "Authentic photo capture of women empowerment monologue during Speak Up Tara production.",
    "uploadedAt": "Jul 16, 2026",
    "status": "approved",
    "uploaderName": "Krishna Subramanian"
  },
  {
    "id": 62,
    "title": "Speak Up Tara - Campus Courtyard Performance",
    "category": "Speak Up Tara",
    "imageUrl": "/aayam_assets/speak_up_tara_user_5.webp",
    "caption": "Authentic photo capture of campus courtyard performance during Speak Up Tara production.",
    "uploadedAt": "Jul 15, 2026",
    "status": "approved",
    "uploaderName": "Sneha Das"
  },
  {
    "id": 63,
    "title": "Speak Up Tara - Chai Break Script Discussion",
    "category": "Speak Up Tara",
    "imageUrl": "/aayam_assets/speak_up_tara_user_6.webp",
    "caption": "Authentic photo capture of chai break script discussion during Speak Up Tara production.",
    "uploadedAt": "Jul 14, 2026",
    "status": "approved",
    "uploaderName": "Abay Nandhiga"
  },
  {
    "id": 64,
    "title": "Speak Up Tara - Street Play Rhythm Percussion",
    "category": "Speak Up Tara",
    "imageUrl": "/aayam_assets/speak_up_tara_user_7.webp",
    "caption": "Authentic photo capture of street play rhythm percussion during Speak Up Tara production.",
    "uploadedAt": "Jul 13, 2026",
    "status": "approved",
    "uploaderName": "Utkarsh (Yuuhi)"
  },
  {
    "id": 65,
    "title": "Speak Up Tara - Audience Interaction",
    "category": "Speak Up Tara",
    "imageUrl": "/aayam_assets/speak_up_tara_user_8.webp",
    "caption": "Authentic photo capture of audience interaction during Speak Up Tara production.",
    "uploadedAt": "Jul 12, 2026",
    "status": "approved",
    "uploaderName": "S. Sri Vaishnavi"
  },
  {
    "id": 66,
    "title": "Speak Up Tara - Social Movement Chorus",
    "category": "Speak Up Tara",
    "imageUrl": "/aayam_assets/speak_up_tara_user_9.jpg",
    "caption": "Authentic photo capture of social movement chorus during Speak Up Tara production.",
    "uploadedAt": "Jul 11, 2026",
    "status": "approved",
    "uploaderName": "Samarth Shrivastava"
  },
  {
    "id": 67,
    "title": "Speak Up Tara - Ensemble Finale Bow",
    "category": "Speak Up Tara",
    "imageUrl": "/aayam_assets/speak_up_tara_user_10.webp",
    "caption": "Authentic photo capture of ensemble finale bow during Speak Up Tara production.",
    "uploadedAt": "Jul 10, 2026",
    "status": "approved",
    "uploaderName": "Krishna Subramanian"
  }
];
