<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Spam Keywords
    |--------------------------------------------------------------------------
    |
    | List of keywords that indicate spam or unwanted content.
    | These will be checked in user-generated content like reviews.
    |
    */
    'spam_keywords' => [
        'spam',
        'scam',
        'fake',
        'phishing',
    ],

    /*
    |--------------------------------------------------------------------------
    | Inappropriate Words
    |--------------------------------------------------------------------------
    |
    | List of inappropriate or offensive words to be filtered.
    | Content containing these words will be rejected.
    |
    */
    'inappropriate_words' => [
        'shit',
        'fuck',
        'dm',
        'đm',
        'vcl',
        'vãi',
        'cc',
        'địt',
        'đéo',
    ],

    /*
    |--------------------------------------------------------------------------
    | Content Validation Rules
    |--------------------------------------------------------------------------
    |
    | Additional validation rules for content quality.
    | These are for future enhancements.
    |
    */
    'max_caps_percentage' => 50,  // Maximum percentage of CAPS in content
    'max_repeated_chars' => 3,    // Maximum consecutive repeated characters (e.g., "aaaa")
];
