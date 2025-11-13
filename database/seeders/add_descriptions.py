#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to automatically add detailed_description to ProductSeeder.php
Parses descriptions from temp.txt file
"""

import re


def parse_temp_file(temp_file='temp.txt'):
    """
    Parse temp.txt to extract album names and their detailed descriptions
    """
    with open(temp_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by album headers (### **Number. AlbumName**)
    albums = {}

    # Pattern to match: ### **1. Album Name**
    pattern = r'###\s+\*\*\d+\.\s+([^*]+)\*\*\s+(.*?)(?=###\s+\*\*\d+\.|$)'

    matches = re.findall(pattern, content, re.DOTALL)

    for album_name, description in matches:
        # Clean album name (remove backticks and whitespace)
        clean_name = album_name.strip().replace('`', '')

        # Clean description (remove leading/trailing whitespace but keep paragraphs)
        clean_desc = description.strip()

        # Remove the introductory sentence if it contains backticks at the start
        # Keep only the main description paragraphs
        paragraphs = [p.strip() for p in clean_desc.split('\n\n') if p.strip()]
        clean_desc = '\n\n'.join(paragraphs)

        albums[clean_name] = clean_desc

    return albums


def add_detailed_description_to_seeder(seeder_content, albums_dict):
    """
    Add detailed_description field to each album in the seeder
    """
    result = seeder_content

    for album_name, description in albums_dict.items():
        # Try to find exact match first
        # Pattern: 'name' => 'Album Name', followed by description line
        pattern = rf"('name' => '{re.escape(album_name)}',\s*'description' => '[^']*',)"

        # Escape quotes and backslashes in description for PHP
        escaped_description = description.replace('\\', '\\\\').replace("'", "\\'")

        # Replacement with detailed_description added (preserving existing line)
        replacement = rf"\1\n                'detailed_description' => '{escaped_description}',"

        # Try to replace
        new_result = re.sub(pattern, replacement, result, count=1)

        if new_result != result:
            print(f"✓ Added detailed_description for: {album_name}")
            result = new_result
        else:
            print(f"⚠ Could not find album: {album_name}")

    return result


def main():
    temp_file = 'temp.txt'
    seeder_file = 'ProductSeeder.php'

    print("📖 Parsing temp.txt...")
    albums = parse_temp_file(temp_file)
    print(f"✓ Found {len(albums)} album descriptions\n")

    print("📝 Reading ProductSeeder.php...")
    with open(seeder_file, 'r', encoding='utf-8') as f:
        seeder_content = f.read()

    print("🔧 Adding detailed descriptions...\n")
    updated_content = add_detailed_description_to_seeder(seeder_content, albums)

    print("\n💾 Writing updated content...")
    with open(seeder_file, 'w', encoding='utf-8') as f:
        f.write(updated_content)

    print(f"\n✅ Successfully updated {seeder_file}")
    print(f"📊 Processed {len(albums)} albums")


if __name__ == '__main__':
    main()
