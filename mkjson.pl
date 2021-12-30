#!/usr/bin/env perl

use strict;
use warnings;
use XML::Simple;
use JSON::XS;
use File::Path qw(make_path);

my $fn  = 'ucd.all.flat';
my $url = "https://www.unicode.org/Public/UCD/latest/ucdxml/$fn.zip";

if ( !-f "$fn.xml" ) {
    my $err;
    $err = system qw/curl -fOR/, $url;
    die "download failed" if $err;
    $err = system qw/unzip/, "$fn.zip";
}

warn "reading $fn.xml...\n";
my $ucd = XMLin("$fn.xml") or die $!;
my $jx  = JSON::XS->new->canonical(1);

{
    my @aref;
    my $aref = $ucd->{repertoire}{char};
    warn 0 + @$aref, " char found.\n";
    for (@$aref) {
        my ( $dir, $path );
        if ( !$_->{cp} ) {
            push @aref, $_;
            next;
        }
        my $cp = sprintf "%06X", hex $_->{cp};
        $cp =~ /\A(..)(..)(..)/;
        $dir  = "ucd/repertoire/char/$1/$2";
        $path = "$dir/$3.json";
        if ( !-d $dir ) {
            make_path($dir);
            warn $dir;
        }
        open my $wh, '>:utf8', $path or die "$path:$!";
        print $wh $jx->encode($_);
    }
    $ucd->{repertoire}{char} = \@aref;
}
{
    my $path = 'ucd.json';
    open my $wh, '>:utf8', $path or die "$path:$!";
    warn $path;
    print $wh $jx->encode($ucd);
}
