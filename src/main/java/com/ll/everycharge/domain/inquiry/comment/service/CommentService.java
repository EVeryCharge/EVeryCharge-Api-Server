package com.ll.everycharge.domain.inquiry.comment.service;

import com.ll.everycharge.domain.inquiry.comment.dto.CommentModifyRequestDto;
import com.ll.everycharge.domain.inquiry.comment.dto.CommentModifyResponseDto;
import com.ll.everycharge.domain.inquiry.comment.dto.CommentRequestDto;
import com.ll.everycharge.domain.inquiry.comment.dto.CommentResponseDto;
import com.ll.everycharge.domain.inquiry.comment.entity.Comment;
import com.ll.everycharge.domain.inquiry.comment.repository.CommentRepository;
import com.ll.everycharge.domain.inquiry.inquiry.entity.Inquiry;
import com.ll.everycharge.domain.inquiry.inquiry.repository.InquiryRepository;
import com.ll.everycharge.domain.member.member.entity.Member;
import com.ll.everycharge.domain.member.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final InquiryRepository inquiryRepository;
    private final MemberRepository memberRepository;


    @Transactional
    public List< CommentResponseDto > save(CommentRequestDto commentRequestDto){

        Member findMember = memberRepository.findById(commentRequestDto.getMemberId())
                .orElseThrow(() -> new NoSuchElementException("해당 member가 존재하지 않습니다."));
        Inquiry findInquiry = inquiryRepository.findById(commentRequestDto.getInquiryId())
                .orElseThrow(() -> new NoSuchElementException("해당 문의글이 존재하지 않습니다."));

        Comment comment = Comment.builder()
                .inquiry(findInquiry)
                .content(commentRequestDto.getContent())
                .member(findMember)
                .build();

        commentRepository.save(comment);

        List< CommentResponseDto > commentResponseDtoList = findInquiry.getComments().stream()
                .map(CommentResponseDto::new)
                .collect(Collectors.toList());


        return commentResponseDtoList;
    }



    @Transactional
    public CommentModifyResponseDto modify(CommentModifyRequestDto requestDto){
        Comment findComment = commentRepository.findById(requestDto.getCommentId())
                .orElseThrow(() -> new RuntimeException("해당 댓글이 존재하지 않습니다."));

        findComment.changeContent(requestDto.getContent());
        return new CommentModifyResponseDto(findComment);
    }

    @Transactional
    public void delete(Long commentId){
        Comment findComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("해당 댓글이 존재하지 않습니다."));
        commentRepository.delete(findComment);
    }

    public List< CommentResponseDto > findAll(Long inquiryId) {
        Inquiry findInquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("해당 문의사항이 존재하지 않습니다."));

        List< CommentResponseDto > commentResponseDtoList = findInquiry.getComments().stream()
                .map(CommentResponseDto::new)
                .collect(Collectors.toList());


        return commentResponseDtoList;
    }

    public CommentResponseDto findById(Long commentId) {
        Comment findComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("해당 댓글이 존재하지 않습니다."));

        return new CommentResponseDto(findComment);
    }
}
