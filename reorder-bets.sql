-- Supabase SQL Editor에서 한 번 실행하세요.
-- 같은 날짜의 기록 순서를 계정의 모든 기기에서 공유합니다.
alter table public.bets add column if not exists sort_order integer;

create or replace function public.reorder_bets(p_date text, p_ids jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  updated_count integer;
begin
  if jsonb_typeof(p_ids) is distinct from 'array' then
    raise exception 'Invalid bet order';
  end if;
  if jsonb_array_length(p_ids) = 0 then
    raise exception 'Invalid bet order';
  end if;

  update public.bets as b
     set sort_order = ordered.position::integer
    from jsonb_array_elements_text(p_ids) with ordinality as ordered(id, position)
   where b.id::text = ordered.id
     and b.date::text = p_date;

  get diagnostics updated_count = row_count;
  if updated_count <> jsonb_array_length(p_ids) then
    raise exception 'Some bets could not be reordered';
  end if;
end;
$$;

revoke all on function public.reorder_bets(text, jsonb) from public, anon;
grant execute on function public.reorder_bets(text, jsonb) to authenticated;
