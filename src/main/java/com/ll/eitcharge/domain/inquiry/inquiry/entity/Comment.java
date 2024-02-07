package com.ll.eitcharge.domain.inquiry.inquiry.entity;

import jakarta.persistence.*;

@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    private Inquiry inquiry;



}
