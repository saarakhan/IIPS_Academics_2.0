
CREATE POLICY "Allow individual read access"
ON public.profiles
FOR SELECT
TO authenticated 
USING (auth.uid() = id);


CREATE POLICY "Allow individual update access"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id); 


