:- compile('../lib/gorgias').
:- compile('../ext/lpwnf').

:- dynamic user_busy/0, user_meeting/0, notify/0, rec_message/0 , known_guest/1, negative_emotion/0, agitation_emotion/0, mailman/0.
:- dynamic not_ring/0, message/0.

rule(r1, ring_bell, []).
rule(r2, silent_bell, []).
rule(p12, prefer(r1, r2), []).

% Negations
% ---------
rule(nr1, neg(not_ring), [ring]).


% If ring also not stay silent, if not ring also stay silent
rule(rule_Not_Ring, neg(ring_bell), [not_ring]).
rule(rule_Stay_Silent, silent_bell, [not_ring]).
rule(rule_Ring, ring_bell, [ring]).
rule(rule_Not_Silent, neg(silent_bell), [ring]).

% Stay silent and notify
rule(rule_Not_Ring_Notify, neg(ring_bell), [not_ring]) :- notify.
% Stay silent and Play Message
rule(rule_Not_Ring_Message, neg(ring_bell), [not_ring, message]).
% Staty silent and notify if mailman
rule(rule_Not_Ring_Mailman_Notify, neg(ring_bell), [not_ring]) :- mailman.


rule(rule_Not_Ring_Known(Guest), neg(ring_bell), [not_ring]) :- known_guest(Guest).
rule(rule_Not_Ring_Negative, neg(ring_bell), [not_ring]) :- negative_emotion.
rule(rule_Not_Ring_Agitation, neg(ring_bell), [not_ring]) :- agitation_emotion.

rule(rule_Not_Ring_Known_Notify(Guest), neg(ring_bell), [not_ring]) :- known_guest(Guest), notify.
rule(rule_Not_Ring_Known_Message(Guest), neg(ring_bell), [not_ring]) :- known_guest(Guest), rec_message.
rule(rule_Not_Ring_Known_Message_Notify(Guest), neg(ring_bell), [not_ring]) :- known_guest(Guest), rec_message, notify.

rule(rule_Not_Ring_Message_Notify, neg(ring_bell), [not_ring]) :- rec_message, notify.
rule(rule_Not_Ring_Negative_Notify, neg(ring_bell), [not_ring]) :- negative_emotion, notify.
rule(rule_Not_Ring_Agitation_Notify, neg(ring_bell), [not_ring]) :- agitation_emotion, notify.
rule(rule_Not_Ring_Negative_Message, neg(ring_bell), [not_ring]) :- negative_emotion, rec_message.
rule(rule_Not_Ring_Agitation_Message, neg(ring_bell), [not_ring]) :- agitation_emotion, rec_message.
rule(rule_Not_Ring_Negative_Message_Notify, neg(ring_bell), [not_ring]) :- negative_emotion, rec_message, notify.
rule(rule_Not_Ring_Agitation_Message_Notify, neg(ring_bell), [not_ring]) :- agitation_emotion, rec_message, notify.
rule(rule_Not_Ring_Known_Message(Guest), neg(ring_bell), [not_ring]) :- known_guest(Guest), rec_message.
rule(rule_Not_Ring_Known_Message_Notify(Guest), neg(ring_bell), [not_ring]) :- known_guest(Guest), rec_message, notify.


% If busy not ring AND stay silent
rule(rule_Busy, not_ring, []) :- user_busy.

% If meeting not ring AND stay silent
rule(rule_Meeting, not_ring, []) :- user_meeting.

% If busy,rec_message not ring AND stay silent AND play_message
rule(rule_Busy_Message, message, []) :- user_busy, rec_message.

% If meeting,rec_message not ring AND stay silent AND play_message
rule(rule_Meeting_Message, message, []) :- user_meeting, rec_message.

% Only known guest, ring bell
rule(rule_Known_Guest(Guest), ring_bell, []) :- known_guest(Guest).

% If busy but known_guest ring bell
rule(rule_Busy_Known_Guest(Guest), ring, []) :- user_busy, known_guest(Guest).

% If meeting but known_guest not ring bell
rule(rule_Meeting_Known_Guest(Guest), not_ring, []) :- user_meeting, known_guest(Guest).

% If mailman ring the bell
rule(rule_Ring_Mailman, ring_bell, []) :- mailman.

% If busy but mailman ring bell
rule(rule_Busy_Mailman, ring, []) :- user_busy, mailman.

% If meeting but mailman not ring bell but notify
rule(rule_Meeting_Mailman, not_ring, []) :- user_meeting, mailman.

% Guest is angry, ring the bell
rule(rule_Negative, ring_bell, []) :- negative_emotion.

% Guest is sad, ring the bell
rule(rule_Agitation, ring_bell, []) :- agitation_emotion.

% If busy and guest have negative emotion ring bell
rule(rule_Busy_Negative, ring, []) :- user_busy, negative_emotion.

% If busy and guest have agitation emotion ring bell
rule(rule_Busy_Agitation, ring, []) :- user_busy, agitation_emotion.

% If meeting and guest have negative emotion ring bell
rule(rule_Meeting_Negative, not_ring, []) :- user_meeting, negative_emotion.

% If busy and guest have agitation emotion ring bell
rule(rule_Meeting_Agitation, not_ring, []) :- user_meeting, agitation_emotion.

% If meeting and guest have negative emotion ring bell
rule(rule_Meeting_Negative, not_ring, []) :- user_meeting, negative_emotion.

% If busy and guest have agitation emotion ring bell
rule(rule_Meeting_Agitation, not_ring, []) :- user_meeting, agitation_emotion.

% If meeting and guest have negative emotion ring bell
rule(rule_Meeting_Negative_Known(Guest), not_ring, []) :- user_meeting, negative_emotion, known_guest(Guest).

% If busy and guest have agitation emotion ring bell
rule(rule_Meeting_Agitation_Known(Guest), ring, []) :- user_meeting, agitation_emotion, known_guest(Guest).



% Prefferences
% ------------
rule(pr1, prefer(rule_Busy_Message, rule_Busy), []).
rule(pr2, prefer(rule_Meeting_Message, rule_Meeting) , []).

rule(pr3, prefer(rule_Busy_Known_Guest(Guest), rule_Busy), []).
rule(pr4, prefer(rule_Meeting_Known_Guest(Guest), rule_Meeting), []).

rule(pr5, prefer(rule_Busy_Known_Guest(Guest), rule_Known_Guest(Guest)), []).
rule(pr6, prefer(rule_Meeting_Known_Guest(Guest), rule_Known_Guest(Guest)), []).

rule(pr7, prefer(rule_Busy_Mailman, rule_Busy), []).
rule(pr8, prefer(rule_Meeting_Mailman, rule_Meeting), []).

rule(pr9, prefer(rule_Busy_Negative, rule_Busy), []).
rule(pr10, prefer(rule_Meeting_Negative, rule_Meeting), []).

rule(pr11, prefer(rule_Busy_Agitation, rule_Busy), []).
rule(pr12, prefer(rule_Meeting_Agitation, rule_Meeting), []).

rule(pr13, prefer(rule_Not_Ring_Notify, rule_Not_Ring), []).
rule(pr14, prefer(rule_Not_Ring_Notify, rule_Stay_Silent), []).

rule(pr15, prefer(rule_Not_Ring_Message, rule_Not_Ring), []).
rule(pr16, prefer(rule_Not_Ring_Message, rule_Stay_Silent), []).

rule(pr17, prefer(rule_Not_Ring_Known(Guest), rule_Known_Guest(Guest)), []).

rule(pr18, prefer(rule_Not_Ring_Mailman_Notify, rule_Ring_Mailman), []).

rule(pr19, prefer(rule_Busy_Negative, rule_Negative), []).
rule(pr20, prefer(rule_Busy_Agitation, rule_Agitation), []).

rule(pr21, prefer(rule_Meeting_Negative, rule_Negative), []).
rule(pr22, prefer(rule_Meeting_Agitation, rule_Agitation), []).

rule(pr23, prefer(rule_Meeting_Agitation_Known(Guest), rule_Meeting_Agitation), []).
rule(pr24, prefer(rule_Meeting_Negative_Known(Guest), rule_Meeting_Negative), []).

rule(pr25, prefer(rule_Not_Ring_Negative, rule_Negative), []).
rule(pr26, prefer(rule_Not_Ring_Agitation, rule_Agitation), []).